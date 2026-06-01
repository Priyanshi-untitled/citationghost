import React,{useState} from 'react';
import './KeyModal.css';
export default function KeyModal({current,onSave,onClose}){
  const [key,setKey]=useState(current||'');
  const [show,setShow]=useState(false);
  return(
    <div className="km-overlay" onClick={onClose}>
      <div className="km-box" onClick={e=>e.stopPropagation()}>
        <div className="km-top"><h2 className="km-title">Anthropic API Key</h2><button className="km-x" onClick={onClose}>✕</button></div>
        <p className="km-desc">Your key is saved only in your browser. Never sent anywhere except Anthropic's servers.</p>
        <div className="km-field">
          <input className="km-input" type={show?'text':'password'} value={key} onChange={e=>setKey(e.target.value)} placeholder="sk-ant-api03-..." autoFocus onKeyDown={e=>e.key==='Enter'&&key.trim()&&onSave(key.trim())}/>
          <button className="km-eye" onClick={()=>setShow(!show)}>{show?'🙈':'👁'}</button>
        </div>
        <a className="km-link" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get a free API key →</a>
        <div className="km-btns">
          <button className="km-cancel" onClick={onClose}>Cancel</button>
          <button className="km-save" onClick={()=>key.trim()&&onSave(key.trim())} disabled={!key.trim()}>Save & Continue</button>
        </div>
      </div>
    </div>
  );
}
