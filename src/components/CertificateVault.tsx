import { Download, ExternalLink, FileText, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { certificates, type Certificate } from '../data/certificates'
import { copy } from '../data/copy'
import { useApp } from '../context/AppContext'

function CertificateDialog({ certificate, onClose }: { certificate: Certificate; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { language } = useApp()
  const t = copy[language]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <dialog ref={dialogRef} className="certificate-dialog" onClick={(event) => {
      if (event.target === dialogRef.current) dialogRef.current?.close()
    }}>
      <div className="dialog-head">
        <div>
          <small>{certificate.issuer} · {certificate.date}</small>
          <h3>{certificate.title}</h3>
        </div>
        <button onClick={() => dialogRef.current?.close()} aria-label={t.close}><X /></button>
      </div>
      <iframe src={`${certificate.pdf}#view=FitH`} title={certificate.title} />
      <div className="dialog-actions">
        <a href={certificate.pdf} target="_blank" rel="noreferrer"><ExternalLink size={17} /> {t.openCertificate}</a>
        <a href={certificate.pdf} download><Download size={17} /> {t.downloadCertificate}</a>
        {certificate.verificationUrl && <a href={certificate.verificationUrl} target="_blank" rel="noreferrer"><ShieldCheck size={17} /> Verify</a>}
      </div>
    </dialog>
  )
}

export function CertificateVault() {
  const { language } = useApp()
  const t = copy[language]
  const [selected, setSelected] = useState<Certificate | null>(null)

  return (
    <section id="certificates" className="certificate-vault section-shell">
      <div className="certificate-heading">
        <span className="eyebrow">04A / {t.certificatesLabel}</span>
        <h2>{t.certificatesTitle}</h2>
        <p>{t.certificatesText}</p>
        <div className="vault-count"><strong>{String(certificates.length).padStart(2, '0')}</strong><span>PDF<br />DOCUMENTS</span></div>
      </div>
      <div className="certificate-track" aria-label="Certificate collection">
        {certificates.map((certificate, index) => (
          <article className="certificate-card" key={certificate.id} style={{ '--card-index': index } as CSSProperties}>
            <button className="certificate-preview" onClick={() => setSelected(certificate)} aria-label={`${t.openCertificate}: ${certificate.title}`}>
              <img src={certificate.thumbnail} alt="" loading="lazy" />
              <span className="certificate-glass" />
              <span className="certificate-number">{String(index + 1).padStart(2, '0')}</span>
            </button>
            <div className="certificate-info">
              <div className="certificate-meta"><span>{certificate.category}</span><span>{certificate.year}</span></div>
              <h3>{certificate.title}</h3>
              <p><FileText size={15} /> {certificate.issuer} · {certificate.type}</p>
              <button onClick={() => setSelected(certificate)}>{t.openCertificate} <ExternalLink size={15} /></button>
            </div>
          </article>
        ))}
      </div>
      {selected && <CertificateDialog certificate={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
