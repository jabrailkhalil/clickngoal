import { useEffect, useState, type FormEvent } from "react";
import { completedDateStats } from "./core/progress-days";
import { calendarFocusTarget } from "./core/progress-calendar";
import { useLocalToday } from "./core/use-local-today";
import { resolveThemeDark, useSystemDark } from "./core/use-system-dark";
import { addComment, DEMO_USER, readCommunity, setDayCompletion, toggleLike, visibleReports, writeReport, type CommunityState, type Report } from "./core/community";

const KEY = "clickngoal.community.v1";
const dateAgo = (today: string, ago: number) => { const date = new Date(`${today}T12:00:00Z`); date.setUTCDate(date.getUTCDate() - ago); return date.toISOString().slice(0, 10); };
function initialState(today: string): CommunityState {
  try { const value = readCommunity(JSON.parse(localStorage.getItem(KEY) ?? "null")); if (value) return value; } catch { /* Use safe fictional examples. */ }
  return { schemaVersion: 1, goals: [
    { id: "reading", ownerId: DEMO_USER, title: "Read each day / Читать каждый день", visibility: "private", completedDates: [dateAgo(today, 2), dateAgo(today, 1)] },
    { id: "walk", ownerId: DEMO_USER, title: "A daily walk / Ежедневная прогулка", visibility: "public", completedDates: [dateAgo(today, 1)] },
    { id: "drawing", ownerId: "ella", title: "Learn to draw / Учиться рисовать", visibility: "public", completedDates: [today] },
  ], reports: [{ id: "example", goalId: "drawing", authorId: "ella", date: today, body: "A ten-minute sketch is still a step forward. / Даже десятиминутный набросок — шаг вперёд.", visibility: "public", likedBy: [], comments: [] }] };
}

export function App() {
  const today = useLocalToday();
  const [state, setState] = useState(() => initialState(today));
  const [locale, setLocale] = useState<"en" | "ru">(() => navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en");
  const ru = locale === "ru";
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const dark = resolveThemeDark(theme, useSystemDark());
  const [view, setView] = useState<"goals" | "feed" | "settings">("goals");
  const [selectedId, setSelectedId] = useState("reading");
  const [selectedDate, setSelectedDate] = useState(today);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [showOwn, setShowOwn] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const ownGoals = state.goals.filter(goal => goal.ownerId === DEMO_USER);
  const selected = ownGoals.find(goal => goal.id === selectedId) ?? ownGoals[0];
  const days = Array.from({ length: 14 }, (_, index) => dateAgo(today, 13 - index));
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; document.documentElement.lang = locale; }, [dark, locale]);
  useEffect(() => { setNote(state.reports.find(report => report.goalId === selected?.id && report.authorId === DEMO_USER && report.date === selectedDate)?.body ?? ""); }, [state.reports, selected?.id, selectedDate]);
  const commit = (next: CommunityState): boolean => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setState(next); setError(""); return true; }
    catch { setError(ru ? "Браузер не сохранил изменения. Разрешите локальное хранилище и повторите." : "Your browser could not save changes. Allow local storage and retry."); return false; }
  };
  const submitNote = (event: FormEvent) => {
    event.preventDefault(); if (!selected) return;
    try { if (commit(writeReport(state, selected.id, DEMO_USER, selectedDate, note, today))) setMessage(ru ? "Заметка сохранена. Отметка выполненного дня меняется отдельно." : "Note saved. The day's completion mark is changed separately."); } catch (error) { setError(String(error)); }
  };
  const createGoal = (event: FormEvent) => {
    event.preventDefault(); const text = title.trim(); if (!text || text.length > 100) return;
    if (state.goals.length >= 100) {setError(ru ? "Достигнут лимит целей локального демо." : "This demo's local goal limit has been reached.");return;}
    const id = crypto.randomUUID();
    if (commit({ ...state, goals: [...state.goals, { id, ownerId: DEMO_USER, title: text, visibility: isPublic ? "public" : "private", completedDates: [] }] })) {setSelectedId(id);setSelectedDate(today);setTitle("");setMessage(ru ? "Цель создана в этом браузере." : "Goal created in this browser.");}
  };
  const author = (id: string) => id === DEMO_USER ? ru ? "Вы" : "You" : "Ella · demo";
  return <div className="shell">
    <header className="top"><a className="brand" href="https://goal.clickn.dev/"><img src="./icon.png" alt="" width="32" height="32" />clickngoal</a><span className="label">{ru ? "Открытая основа · демо" : "Open foundation · demo"}</span><select aria-label={ru ? "Язык" : "Language"} value={locale} onChange={event => setLocale(event.target.value as "ru" | "en")}><option value="en">English</option><option value="ru">Русский</option></select></header>
    <div className="notice">{ru ? "Локальный пример. Люди и записи вымышлены; ваши правки остаются в этом браузере." : "Local demo. People and posts are fictional; your edits stay in this browser."} <a href="https://goal.clickn.dev/">{ru ? "Открыть настоящую соцсеть" : "Open the real social network"} ↗</a></div>
    <nav className="tabs" aria-label={ru ? "Разделы" : "Sections"}>{(["goals", "feed", "settings"] as const).map(item => <button key={item} type="button" aria-current={view === item ? "page" : undefined} onClick={() => {setView(item);setMessage("");}}>{({goals: ru ? "Мои цели" : "My goals",feed: ru ? "Лента" : "Feed",settings: ru ? "Настройки" : "Settings"})[item]}</button>)}</nav>
    {error && <p role="alert" className="error">{error}</p>}{message && <p role="status" className="status">{message}</p>}
    <main>
      {view === "goals" && <><div className="heading"><h1>{ru ? "Небольшой шаг сегодня" : "One small step today"}</h1><p>{ru ? "Откройте цель и отметьте выполненный день." : "Open a goal and mark a day as completed."}</p></div>
      <div className="goal-layout"><aside aria-label={ru ? "Ваши цели" : "Your goals"}>{ownGoals.map(goal => { const stats = completedDateStats(goal.completedDates, today); const done = stats.dates.includes(today);return <button className={`goal-card ${selected?.id === goal.id ? "active" : ""}`} type="button" key={goal.id} aria-pressed={selected?.id === goal.id} onClick={() => {setSelectedId(goal.id);setSelectedDate(today);setMessage("");}}><strong>{goal.title}</strong><span className={done ? "done" : "pending"}>{done ? ru ? "Сегодня выполнено" : "Done today" : ru ? "Ждёт шага сегодня" : "Ready for today's step"}</span><small>{stats.completedDays} {ru ? "дней" : "days"} · {ru ? "серия" : "streak"} {stats.currentStreak}</small></button>;})}
      <form className="panel create" onSubmit={createGoal}><label htmlFor="new-goal">{ru ? "Новая цель" : "New goal"}</label><input id="new-goal" value={title} onChange={event => setTitle(event.target.value)} maxLength={100} required placeholder={ru ? "Например, учить английский" : "For example, learn a language"} /><label className="check"><input type="checkbox" checked={isPublic} onChange={event => setPublic(event.target.checked)} />{ru ? "Публичная в локальном демо" : "Public in this local demo"}</label><button type="submit" className="primary">{ru ? "Создать цель" : "Create goal"}</button></form></aside>
      {selected && <section className="panel progress"><h2>{selected.title}</h2><p className="muted">{selected.visibility === "private" ? ru ? "Личная цель" : "Private goal" : ru ? "Публичная цель в демо" : "Public demo goal"} · {ru ? "Последние 14 дней" : "Last 14 days"}</p><div className="calendar" aria-label={ru ? "Выберите день" : "Choose a day"}>{days.map(day => <button type="button" key={day} data-date={day} aria-pressed={selectedDate === day} aria-label={`${day}: ${selected.completedDates.includes(day) ? ru ? "выполнено" : "completed" : ru ? "не выполнено" : "not completed"}`} className={`${selected.completedDates.includes(day) ? "completed" : ""} ${day === selectedDate ? "selected" : ""}`} onClick={() => {setSelectedDate(day);setMessage("");}} onKeyDown={event => {const target = calendarFocusTarget(day, event.key, event.shiftKey, today);if (target && days.includes(target)) {event.preventDefault();setSelectedDate(target);document.querySelector<HTMLButtonElement>(`[data-date="${target}"]`)?.focus();}}}>{Number(day.slice(8))}<span>{selected.completedDates.includes(day) ? "✓" : "·"}</span></button>)}</div>
      <div className="selected-day"><strong>{new Intl.DateTimeFormat(locale, {day:"numeric",month:"long",year:"numeric"}).format(new Date(`${selectedDate}T12:00:00`))}</strong><label className="check"><input type="checkbox" checked={selected.completedDates.includes(selectedDate)} onChange={event => commit(setDayCompletion(state, selected.id, DEMO_USER, selectedDate, event.target.checked, today))} />{ru ? "День выполнен" : "Day completed"}</label></div>
      <form onSubmit={submitNote}><label htmlFor="note">{ru ? "Заметка выбранного дня" : "Selected day's note"}</label><textarea id="note" value={note} onChange={event => setNote(event.target.value)} rows={5} maxLength={1200} required placeholder={ru ? "Что удалось сделать?" : "What did you do?"} /><div className="form-footer"><small>{note.length}/1200</small><button className="primary" type="submit">{ru ? "Сохранить заметку" : "Save note"}</button></div></form><p className="muted">{ru ? "Выбор ячейки показывает день. Галочка отмечает выполнение. Сохранение заметки не переключает галочку." : "Selecting a cell shows that day. The checkbox marks completion. Saving a note does not toggle completion."}</p></section>}</div></>}
      {view === "feed" && <section className="feed"><h1>{ru ? "Прогресс рядом" : "Progress around you"}</h1><p className="muted">{ru ? "Пример ленты: публичные записи и ваши личные заметки." : "Example feed: public posts and your own private notes."}</p>{visibleReports(state, DEMO_USER, showOwn).map(report => <article className="panel report" key={report.id}><header><div className="avatar" aria-hidden="true">{author(report.authorId).slice(0,1)}</div><div><strong>{author(report.authorId)}</strong><p className="muted">{report.date} · {report.visibility === "private" ? ru ? "Только вам" : "Only you" : ru ? "Публичная" : "Public"}</p></div></header><h2>{state.goals.find(goal => goal.id === report.goalId)?.title}</h2><p className="report-text">{report.body}</p><button type="button" className="reaction" aria-pressed={report.likedBy.includes(DEMO_USER)} onClick={() => commit(toggleLike(state, report.id, DEMO_USER))}>{report.likedBy.includes(DEMO_USER) ? "♥" : "♡"} {report.likedBy.length} · {ru ? "Поддержать" : "Support"}</button><details><summary>{ru ? "Комментарии" : "Comments"} ({report.comments.length})</summary>{report.comments.map(comment => <p key={comment.id}><strong>{author(comment.authorId)}</strong> · {comment.body}</p>)}<CommentForm report={report} ru={ru} onSubmit={body => {try{return commit(addComment(state, report.id, DEMO_USER, body, crypto.randomUUID()));}catch(error){setError(String(error));return false;}}} /></details></article>)}</section>}
      {view === "settings" && <section className="panel settings"><h1>{ru ? "Настройки демо" : "Demo settings"}</h1><label htmlFor="theme">{ru ? "Оформление" : "Appearance"}</label><select id="theme" value={theme} onChange={event => setTheme(event.target.value as typeof theme)}><option value="system">{ru ? "Как на устройстве" : "Follow device"}</option><option value="light">{ru ? "Светлая" : "Light"}</option><option value="dark">{ru ? "Тёмная" : "Dark"}</option></select><h2>{ru ? "Лента" : "Feed"}</h2><label className="check"><input type="checkbox" checked={showOwn} onChange={event => setShowOwn(event.target.checked)} />{ru ? "Показывать мои записи" : "Show my reports"}</label><p className="muted">{ru ? "Настройки этого примера действуют в текущем сеансе. Цели и заметки сохраняются локально." : "These demo preferences apply to the current session. Goals and notes are stored locally."}</p><a href="https://github.com/jabrailkhalil/clickngoal">{ru ? "Код и документация" : "Source and documentation"} ↗</a></section>}
    </main><footer>MIT · <a href="https://github.com/jabrailkhalil/clickngoal">clickngoal community</a> · <a href="https://goal.clickn.dev/">{ru ? "Рабочая платформа" : "Hosted platform"}</a></footer>
  </div>;
}
function CommentForm({ report, ru, onSubmit }: { report: Report; ru: boolean; onSubmit: (body: string) => boolean }) {
  const [body, setBody] = useState("");
  return <form className="comment-form" onSubmit={event => {event.preventDefault();if(onSubmit(body))setBody("");}}><label htmlFor={`comment-${report.id}`}>{ru ? "Ваш комментарий" : "Your comment"}</label><input id={`comment-${report.id}`} value={body} onChange={event => setBody(event.target.value)} required maxLength={400} /><button type="submit">{ru ? "Отправить в демо" : "Post in demo"}</button></form>;
}
