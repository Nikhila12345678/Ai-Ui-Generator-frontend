import { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

export default function App() {
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [plan, setPlan] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState('default');
  const [history, setHistory] = useState([]);

  const handleGenerate = async () => {
    if (!message.trim()) {
      alert('Please describe the UI first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
          previousPlan: plan,
          previousCode: code,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCode(data.code || '// No code generated');
      setPlan(data.plan);
      setExplanation(data.explanation || '');
      
      // Add to history
      setHistory(prev => [...prev, {
        id: data.version,
        message,
        timestamp: new Date().toISOString(),
      }]);

      setMessage(''); // Clear input after successful generation
    } catch (e) {
      console.error('Generate error:', e);
      setError(e.message || 'Failed to generate UI');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setCode(data.code || '// No code generated');
      setPlan(data.plan);
      setExplanation(data.explanation || '');
    } catch (e) {
      console.error('Regenerate error:', e);
      setError(e.message || 'Failed to regenerate');
    } finally {
      setLoading(false);
    }
  };

  // Create preview HTML with actual code execution
const createPreviewHTML = () => {
    console.log('CODE RECEIVED:', code); 
    if (!code) {
      return '<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#666;"><p>No preview yet. Describe a UI to get started!</p></body></html>';
    }

   // Clean the code more thoroughly
let cleanedCode = code
  .replace(/```jsx\n?/g, '')
  .replace(/```javascript\n?/g, '')
  .replace(/```\n?/g, '')
  .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\n?/g, '') // Remove import statements
  .replace(/import\s+React\s+from\s+['"]react['"];?\n?/g, '') // Remove React imports
  .trim();

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background-color: #f3f4f6;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState } = React;
    
    // Component definitions
    function Button({ label, onClick, variant = 'primary', disabled = false }) {
      const styles = {
        base: {
          padding: '10px 20px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.2s ease',
        },
        primary: { backgroundColor: '#3b82f6', color: 'white' },
        secondary: { backgroundColor: '#e5e7eb', color: '#374151' },
      };
      return (
        <button 
          onClick={onClick} 
          disabled={disabled} 
          style={{...styles.base, ...(variant === 'primary' ? styles.primary : styles.secondary)}}
        >
          {label || 'Button'}
        </button>
      );
    }

    function Card({ children, title, padding = 'medium' }) {
      const paddingValues = { small: '12px', medium: '24px', large: '32px' };
      const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: paddingValues[padding] || paddingValues.medium,
      };
      const titleStyle = {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#111827',
      };
      return (
        <div style={cardStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {children}
        </div>
      );
    }

    function Input({ placeholder, value, onChange, type = 'text', label }) {
      const containerStyle = { marginBottom: '16px' };
      const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
      };
      const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
      };
      return (
        <div style={containerStyle}>
          {label && <label style={labelStyle}>{label}</label>}
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            style={inputStyle}
          />
        </div>
      );
    }

    function Modal({ title, children, onClose, isOpen = true }) {
      if (!isOpen) return null;
      const backdropStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
      };
      const modalStyle = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      };
      return (
        <div style={backdropStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
              {title && <h3 style={{margin:0}}>{title}</h3>}
              <button onClick={onClose} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer'}}>×</button>
            </div>
            {children}
          </div>
        </div>
      );
    }

    // Generated component code (cleaned)
    ${cleanedCode}

    // Render
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<GeneratedUI />);
    } catch (error) {
      document.body.innerHTML = '<div style="padding:20px;color:red;">Error rendering UI: ' + error.message + '</div>';
      console.error('Render error:', error);
    }
  </script>
</body>
</html>`;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* LEFT PANEL: Chat */}
      <div style={{
        width: '30%',
        borderRight: '1px solid #e5e7eb',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
      }}>
        <h2 style={{ marginTop: 0, fontSize: '20px', fontWeight: '600' }}>AI UI Generator</h2>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
          {history.map((item, idx) => (
            <div key={idx} style={{
              marginBottom: '12px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                {item.id}
              </div>
              <div style={{ fontSize: '14px' }}>{item.message}</div>
            </div>
          ))}
          
          {explanation && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: '6px',
              border: '1px solid #bfdbfe',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: '6px' }}>
                AI Explanation:
              </div>
              <div style={{ fontSize: '14px', color: '#1e3a8a' }}>{explanation}</div>
            </div>
          )}
        </div>

        <div>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the UI you want to create..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '12px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating...' : code ? 'Modify UI' : 'Generate UI'}
            </button>
            
            {code && (
              <button
                onClick={handleRegenerate}
                disabled={loading}
                style={{
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                🔄
              </button>
            )}
          </div>
          
          {error && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#991b1b',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE PANEL: Code Editor */}
      <div style={{
        width: '35%',
        borderRight: '1px solid #e5e7eb',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600' }}>Generated Code</h3>
        <pre style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#1f2937',
          color: '#e5e7eb',
          padding: '16px',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.6',
          margin: 0,
        }}>
          {code || '// Code will appear here after generation'}
        </pre>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600' }}>Live Preview</h3>
        <iframe
          title="preview"
          style={{
            flex: 1,
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            backgroundColor: 'white',
          }}
          srcDoc={createPreviewHTML()}
        />
      </div>
    </div>
  );
}