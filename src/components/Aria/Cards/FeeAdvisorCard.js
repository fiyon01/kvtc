import React from 'react';

const FeeAdvisorCard = ({ onAction }) => {
  const styles = {
    card: {
      background: 'linear-gradient(135deg, #10b981, #047857)',
      color: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
      fontFamily: '"Inter", system-ui, sans-serif',
      maxWidth: '450px',
      margin: '0 auto',
      transition: 'transform 0.3s ease',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      marginBottom: '12px',
      marginTop: '0'
    },
    text: {
      fontSize: '0.95rem',
      lineHeight: '1.6',
      marginBottom: '24px',
      opacity: '0.95'
    },
    termsContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '28px',
    },
    termBox: {
      flex: 1,
      background: 'rgba(255, 255, 255, 0.15)',
      padding: '12px 8px',
      borderRadius: '12px',
      textAlign: 'center',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'background 0.2s ease',
    },
    termTitle: {
      display: 'block',
      fontWeight: '600',
      fontSize: '0.9rem',
    },
    button: {
      background: '#ffffff',
      color: '#047857',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }
  };

  return (
    <div 
      style={styles.card}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h3 style={styles.title}>Flexible Fee Payment</h3>
      <p style={styles.text}>
        At Kinoo VTC, courses are subsidized by the government (KSh 27,000/year). You don't have to pay everything at once!
      </p>
      <div style={styles.termsContainer}>
        <div 
          style={styles.termBox}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
        >
          <span style={styles.termTitle}>Term 1</span>
        </div>
        <div 
          style={styles.termBox}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
        >
          <span style={styles.termTitle}>Term 2</span>
        </div>
        <div 
          style={styles.termBox}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
        >
          <span style={styles.termTitle}>Term 3</span>
        </div>
      </div>
      <button 
        style={styles.button}
        onClick={() => onAction && onAction('send_message', 'Help me choose a course')}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 12px -1px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
      >
        Help me choose a course
      </button>
    </div>
  );
};

export default FeeAdvisorCard;
