import { useEffect, useMemo, useRef, useState } from 'react'
import {
  GraduationCap, Search, Plus, Users, UserRound, Trash2, Eye,
  X, CheckCircle2, AlertCircle, Keyboard, BookOpen, Mail, Phone,
  Hash, CalendarDays, ShieldCheck
} from 'lucide-react'

const initialStudents = [
  { id: 'STU-1001', name: 'Aline Uwase', email: 'aline@example.com', phone: '+250 788 000 101', course: 'Software Development', year: 'Year 2', createdAt: '2026-10-01' },
  { id: 'STU-1002', name: 'Patrick Mugisha', email: 'patrick@example.com', phone: '+250 788 000 102', course: 'Networking', year: 'Year 1', createdAt: '2026-10-03' },
  { id: 'STU-1003', name: 'Grace Ingabire', email: 'grace@example.com', phone: '+250 788 000 103', course: 'Information Technology', year: 'Year 3', createdAt: '2026-10-05' }
]
const emptyForm = { name: '', email: '', phone: '', course: '', year: 'Year 1' }

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('sms-students')
      return saved ? JSON.parse(saved) : initialStudents
    } catch { return initialStudents }
  })
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchRef = useRef(null)
  const nameRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('sms-students', JSON.stringify(students))
  }, [students])

  // Keyboard shortcuts: Ctrl/Cmd + K focuses search; Escape closes the student view.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return students
    return students.filter((student) =>
      [student.id, student.name, student.email, student.course].some((value) =>
        value.toLowerCase().includes(term)
      )
    )
  }, [students, query])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter a name with at least 2 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!/^[+0-9][0-9\s()-]{7,18}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    if (!form.course) next.course = 'Choose a course.'
    const duplicateEmail = students.some((student) => student.email.toLowerCase() === form.email.trim().toLowerCase())
    if (duplicateEmail) next.email = 'A student with this email is already registered.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const registerStudent = async (event) => {
    event.preventDefault()
    if (isSubmitting) return // Prevent repeated submissions.
    if (!validate()) return
    setIsSubmitting(true)
    // A short async step demonstrates disabling the submit button against double clicks.
    await new Promise((resolve) => setTimeout(resolve, 350))
    const student = {
      ...form,
      id: `STU-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    }
    setStudents((current) => [student, ...current])
    setForm(emptyForm)
    setErrors({})
    setNotice(`${student.name} was registered successfully.`)
    setIsSubmitting(false)
    nameRef.current?.focus()
    window.setTimeout(() => setNotice(''), 3500)
  }

  const deleteStudent = (event, id) => {
    // Stop the row's click handler so Delete does not also open the student.
    event.stopPropagation()
    const student = students.find((item) => item.id === id)
    if (!student) return
    if (!window.confirm(`Delete ${student.name} from the student records?`)) return
    setStudents((current) => current.filter((item) => item.id !== id))
    if (selected?.id === id) setSelected(null)
    setNotice(`${student.name} was deleted.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><GraduationCap size={23} /></div><div><strong>Campus<span>Flow</span></strong><small>ADMIN PORTAL</small></div></div>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><Users size={18} /> Student records</div>
        <div className="sidebar-bottom"><div className="admin-avatar">AD</div><div><strong>Administrator</strong><small>System manager</small></div><ShieldCheck className="shield" size={17} /></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">ADMINISTRATION / STUDENTS</p><h1>Student management</h1><p className="subtitle">Register, find and manage student records in one place.</p></div><div className="top-chip"><span className="online-dot" /> System active</div></header>

        {notice && <div className="notice"><CheckCircle2 size={17} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={16}/></button></div>}

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-icon purple"><Users size={20}/></div><div><span>Total students</span><strong>{students.length}</strong><small>Registered records</small></div></div>
          <div className="stat-card"><div className="stat-icon blue"><BookOpen size={20}/></div><div><span>Courses</span><strong>{new Set(students.map(s => s.course)).size}</strong><small>Courses represented</small></div></div>
          <div className="stat-card"><div className="stat-icon green"><UserRound size={20}/></div><div><span>Showing</span><strong>{filteredStudents.length}</strong><small>Matching records</small></div></div>
        </section>

        <section className="content-grid">
          <div className="panel register-panel">
            <div className="panel-heading"><div><div className="heading-icon"><Plus size={18}/></div><div><h2>Register a student</h2><p>Enter the student's information below.</p></div></div><span className="required-note">* Required</span></div>
            <form onSubmit={registerStudent} noValidate>
              <div className="field"><label htmlFor="name">Full name <b>*</b></label><input ref={nameRef} id="name" name="name" value={form.name} onChange={updateField} placeholder="e.g. Jean Claude" aria-invalid={!!errors.name}/>{errors.name && <small className="error"><AlertCircle size={13}/>{errors.name}</small>}</div>
              <div className="field"><label htmlFor="email">Email address <b>*</b></label><div className="input-icon"><Mail size={16}/><input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="student@example.com" aria-invalid={!!errors.email}/></div>{errors.email && <small className="error"><AlertCircle size={13}/>{errors.email}</small>}</div>
              <div className="field"><label htmlFor="phone">Phone number <b>*</b></label><div className="input-icon"><Phone size={16}/><input id="phone" name="phone" value={form.phone} onChange={updateField} placeholder="+250 7..." aria-invalid={!!errors.phone}/></div>{errors.phone && <small className="error"><AlertCircle size={13}/>{errors.phone}</small>}</div>
              <div className="field"><label htmlFor="course">Course / programme <b>*</b></label><select id="course" name="course" value={form.course} onChange={updateField} aria-invalid={!!errors.course}><option value="">Select a course</option><option>Software Development</option><option>Information Technology</option><option>Networking</option><option>Accountancy</option><option>Electrical Technology</option><option>Business Management</option></select>{errors.course && <small className="error"><AlertCircle size={13}/>{errors.course}</small>}</div>
              <div className="field"><label htmlFor="year">TRADE</label><select id="TRADE" name="TRADE" value={form.TRADE} onChange={updateField}><option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option><option>Year 5</option></select></div>
              <button className="primary-button submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? <><span className="spinner"/> Registering...</> : <><Plus size={17}/> Register student</>}</button>
            </form>
            <p className="form-footnote"><ShieldCheck size={14}/> Student records are saved in this browser.</p>
          </div>

          <div className="panel records-panel">
            <div className="records-heading"><div><h2>Student directory</h2><p>Click a record to view full details.</p></div><span className="count-pill">{students.length} records</span></div>
            <div className="search-box"><Search size={18}/><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, ID or course..." aria-label="Search students"/><kbd>Ctrl K</kbd></div>
            <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>COURSE</th><th>TRADE</th><th className="actions-head">ACTIONS</th></tr></thead><tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} onClick={() => setSelected(student)} className="student-row" tabIndex="0" onKeyDown={(e) => { if (e.key === 'Enter') setSelected(student) }}>
                  <td><div className="student-cell"><div className={`student-avatar avatar-${index % 4}`}>{student.name.split(' ').map(part => part[0]).slice(0,2).join('').toUpperCase()}</div><div><strong>{student.name}</strong><small>{student.email}</small></div></div></td>
                  <td><span className="id-text">{student.id}</span></td><td>{student.course}</td><td><span className="year-pill">{student.year}</span></td>
                  <td><div className="action-buttons"><button className="icon-button view" title="View student" aria-label={`View ${student.name}`} onClick={(e) => { e.stopPropagation(); setSelected(student) }}><Eye size={16}/></button><button className="icon-button delete" title="Delete student" aria-label={`Delete ${student.name}`} onClick={(e) => deleteStudent(e, student.id)}><Trash2 size={16}/></button></div></td>
                </tr>
              ))}
              {filteredStudents.length === 0 && <tr><td colSpan="5"><div className="empty-state"><Search size={25}/><strong>No students found</strong><span>Try another search term or register a new student.</span></div></td></tr>}
            </tbody></table></div>
            <div className="table-footer"><span>Showing {filteredStudents.length} of {students.length} students</span><span><span className="online-dot"/> Live local data</span></div>
          </div>
        </section>
        <footer className="page-footer"><span>© 2026 CampusFlow Student Management</span><span><Keyboard size={14}/> Shortcut: <b>Ctrl/Cmd + K</b> to search · <b>Esc</b> to close details</span></footer>
      </main>

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-top"><span>STUDENT PROFILE</span><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={19}/></button></div>
        <div className="profile-header"><div className="profile-avatar">{selected.name.split(' ').map(part => part[0]).slice(0,2).join('').toUpperCase()}</div><h2 id="modal-title">{selected.name}</h2><p>{selected.id}</p></div>
        <div className="detail-list"><div><Mail size={17}/><span><small>Email address</small><strong>{selected.email}</strong></span></div><div><Phone size={17}/><span><small>Phone number</small><strong>{selected.phone}</strong></span></div><div><BookOpen size={17}/><span><small>Course / programme</small><strong>{selected.course}</strong></span></div><div><CalendarDays size={17}/><span><small>Study year · Registered</small><strong>{selected.year} · {selected.createdAt}</strong></span></div></div>
        <button className="primary-button modal-close" onClick={() => setSelected(null)}>Close profile</button>
      </section></div>}
    </div>
  )
}

export default App
