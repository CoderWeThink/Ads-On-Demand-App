import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Eye, EyeOff, X } from 'lucide-react';
import approvedLogo from './approved-logo.png';
import './styles.css';
import './brand.css';
import { Dashboard } from './Dashboard';

function Welcome() {
  const [signedIn, setSignedIn] = useState(false);
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const create = mode === 'create';
  function change(next: 'signin' | 'create') { setMode(next); setMessage(''); setVisible(false); }
  function unavailable(kind: string) { setMessage(`${kind} will be available when account services are connected. This welcome-screen build does not save or send your details.`); }
  if (signedIn) return <Dashboard onSignOut={() => {setSignedIn(false); setMessage('');}}/>;
  return <main className="welcome">
    <section className="hero" aria-label="Welcome to Ads on Demand">
      <div className="brand-logo-frame">
        <img src={approvedLogo} alt="Ads on Demand" className="brand-logo" />
      </div>
      <div className="hero-copy"><div className="eyebrow">YOUR DESKTOP, YOUR ADS.</div><h1>Ads you<br/><span>actually</span> want.</h1><p>Pick ads that fit your interests and earn in ways that are easier than ever before.</p></div>
    </section>
    <section className="form-area">
      <div className="form-content"><header><h2>{create ? 'Create your account' : 'Welcome back'}</h2><p>{create ? 'One account for your website and Windows app.' : 'Sign in to manage your docks and preferences.'}</p></header>
      <div className="tabs" role="tablist" aria-label="Account action"><button role="tab" id="signin-tab" aria-controls="account-panel" aria-selected={!create} onClick={() => change('signin')}>Sign in</button><button role="tab" id="create-tab" aria-controls="account-panel" aria-selected={create} onClick={() => change('create')}>Create account</button></div>
      <div id="account-panel" role="tabpanel" aria-labelledby={create ? 'create-tab' : 'signin-tab'}>
        <form key={mode} onSubmit={event => { event.preventDefault(); setSignedIn(true); }}>
          <label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" autoComplete="off" required/>
          <div className="password-label"><label htmlFor="password">{create ? 'Create password' : 'Password'}</label>{!create && <button type="button" className="text-button" onClick={() => unavailable('Password recovery')}>Forgot password?</button>}</div>
          <div className="password-input"><input id="password" type={visible ? 'text' : 'password'} placeholder="At least 5 characters" minLength={5} autoComplete="off" required/><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
          {create && <div className="availability"><span>Availability</span><strong>United States</strong></div>}
          <button className="primary" type="submit">{create ? 'Create my account' : 'Sign in'}<ArrowRight size={18}/></button>
        </form>
        <div className="divider">OR</div><button className="google" onClick={() => unavailable('Google sign-in')}><span className="google-letter" aria-hidden="true">G</span>{create ? 'Sign up with Google' : 'Continue with Google'}</button>
        <p className="availability-note">For this local preview, use any email and a password of at least 5 characters. No account is created and your details are not saved or sent.</p>
        <p className="account">{create ? 'Already have an account?' : 'New to Ads on Demand?'} <button className="text-button" onClick={() => change(create ? 'signin' : 'create')}>{create ? 'Sign in' : 'Create an account'}</button></p>
      </div>
      {message && <div className="notice" role="status"><p>{message}</p><button aria-label="Dismiss message" onClick={() => setMessage('')}><X size={16}/></button></div>}
      </div>
    </section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Welcome/></React.StrictMode>);
