import { createClient } from '@supabase/supabase-js';

const email = process.argv[2] || 'kamaujonathan54@gmail.com';
const password = process.argv[3] || '12345678';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.startsWith('your_')) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Admin password must be at least 8 characters.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(targetEmail) {
  const normalized = targetEmail.toLowerCase();

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;

    const user = data?.users?.find(item => item.email?.toLowerCase() === normalized);
    if (user) return user;
    if (!data?.users || data.users.length < 100) return null;
  }

  return null;
}

try {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(existingUser.user_metadata || {}),
        role: 'admin',
      },
      app_metadata: {
        ...(existingUser.app_metadata || {}),
        role: 'admin',
      },
    });

    if (error) throw error;
    console.log(`Admin user updated: ${email}`);
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
      app_metadata: { role: 'admin' },
    });

    if (error) throw error;
    console.log(`Admin user created: ${email}`);
  }
} catch (error) {
  console.error(`Could not create/update admin user "${email}": ${error.message}`);
  process.exit(1);
}
