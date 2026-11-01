'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Attachment, CreatePostInput, GroupSummary } from '@meridian/contracts';
import { community } from '@meridian/domain';
import { ApiError } from '@meridian/api-client';
import { Avatar, Button, Pill } from '@meridian/ui';
import { format, plural } from '@meridian/i18n';
import { api } from '@/lib/api';
import { SAMPLE_MODE } from '@/lib/sample';
import { addSamplePost, applyMembership } from '@/lib/sampleStore';
import { AttachmentIcon } from '@/components/community/AttachmentCard';
import { CloseIcon } from '@/components/community/icons';
import styles from './Compose.module.css';

type PostType = 'insight' | 'question' | 'poll';
type PickKind = 'company' | 'book' | 'deal';
const TYPES: PostType[] = ['insight', 'question', 'poll'];
const KINDS: PickKind[] = ['company', 'book', 'deal'];
const DAYS = [1, 3, 7] as const;

interface Props {
  locale: string;
  groups: GroupSummary[];
  attachables: Attachment[];
  initialAttachment: Attachment | null;
  initialGroupId: string | null;
  t: Record<string, string>;
}

export function ComposeScreen({ locale, groups, attachables, initialAttachment, initialGroupId, t }: Props) {
  const router = useRouter();
  const [type, setType] = useState<PostType>('insight');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [days, setDays] = useState<(typeof DAYS)[number]>(3);
  const [audience, setAudience] = useState<string>('everyone');
  const [attachment, setAttachment] = useState<Attachment | null>(initialAttachment);
  const [picking, setPicking] = useState<PickKind | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<'idle' | 'posting' | 'failed' | 'promise'>('idle');
  const [joinedIds, setJoinedIds] = useState<string[]>(groups.filter((g) => g.joined).map((g) => g.id));

  // Groups the person belongs to, including joins made in this browser (sample mode).
  useEffect(() => {
    const ids = groups.map((g) => ({ g, m: SAMPLE_MODE ? applyMembership(g) : { joined: g.joined } })).filter((x) => x.m.joined).map((x) => x.g.id);
    setJoinedIds(ids);
    if (initialGroupId && ids.includes(initialGroupId)) setAudience(`group:${initialGroupId}`);
  }, [groups, initialGroupId]);

  const errors = community.validateDraft({ type, text, options, hasDeal: attachment?.kind === 'deal' });
  const dirty = text.trim().length > 0 || options.some((o) => o.trim()) || (attachment !== null && attachment !== initialAttachment);
  const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? id;
  const chars = text.length;
  const posting = status === 'posting';

  const leave = () => {
    if (window.history.length > 1) router.back();
    else router.push(`/${locale}/community`);
  };
  const cancel = () => (dirty ? setConfirming(true) : leave());

  const submit = async () => {
    if (errors.length > 0 || posting) return;
    const groupId = audience.startsWith('group:') ? audience.slice(6) : undefined;
    const input: CreatePostInput = {
      type, text: text.trim(), audience: groupId ? 'group' : (audience as 'everyone' | 'followers'),
      ...(groupId ? { groupId } : {}),
      ...(type === 'poll' ? { options: options.map((o) => o.trim()).filter(Boolean), pollDays: days } : {}),
      ...(attachment ? { attachment: { kind: attachment.kind, id: attachment.id } } : {}),
    };
    setStatus('posting');
    try {
      const post = await api.community.createPost(input);
      if (SAMPLE_MODE) addSamplePost(post, groupId);
      router.push(groupId ? `/${locale}/groups/${groupId}` : `/${locale}/community`);
    } catch (e) {
      setStatus(e instanceof ApiError && e.code === 'return_promise' ? 'promise' : 'failed');
    }
  };

  const togglePick = (k: PickKind) => {
    if (attachment?.kind === k) { setAttachment(null); setPicking(null); return; }
    setPicking(picking === k ? null : k);
  };
  const choices = picking ? attachables.filter((a) => a.kind === picking) : [];

  return (
    <>
      <header className={styles.bar}>
        <div className={styles.barIn}>
          <button type="button" className={styles.cancel} onClick={cancel}>{t.cancel}</button>
          <span className={styles.title}>{t.title}</span>
          <Button onClick={submit} disabled={errors.length > 0 || posting}>{posting ? t.posting : t.post}</Button>
        </div>
      </header>
      <main className={styles.wrap} aria-busy={posting}>
        {confirming ? (
          <div className={styles.dc} role="alertdialog" aria-labelledby="discard-q" onKeyDown={(e) => { if (e.key === 'Escape') setConfirming(false); }}>
            <p id="discard-q">{t.discardTitle}</p>
            <div className={styles.dcBtns}>
              <Button variant="outline" onClick={leave}>{t.discard}</Button>
              <Button autoFocus onClick={() => setConfirming(false)}>{t.keepEditing}</Button>
            </div>
          </div>
        ) : null}

        <div className={styles.seg} role="group" aria-label={t.typeLabel}>
          {TYPES.map((x) => <Pill key={x} selected={x === type} onClick={() => setType(x)}>{t[`type_${x}`]}</Pill>)}
        </div>

        <div className={styles.who}>
          <Avatar kind="round" name="You" size={40} fontSize={16} />
          <div>
            <b>{t.you}</b>
            <label className={styles.aud}>
              {t.audience}
              <select className={styles.select} value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option value="everyone">{t.aud_everyone}</option>
                <option value="followers">{t.aud_followers}</option>
                {joinedIds.map((id) => <option key={id} value={`group:${id}`}>{format(t.aud_group ?? '', { name: groupName(id) })}</option>)}
              </select>
            </label>
          </div>
        </div>

        <textarea
          className={styles.text} value={text} maxLength={community.MAX_POST_CHARS} autoFocus aria-label={t.textLabel}
          aria-describedby="compose-count" placeholder={t[`ph_${type}`]} onChange={(e) => { setText(e.target.value); if (status !== 'posting') setStatus('idle'); }}
        />
        <div className={styles.meta}><span id="compose-count" className={chars > 450 ? styles.warn : undefined}>{format(t.counter ?? '', { n: chars })}</span></div>

        {type === 'poll' ? (
          <div className={styles.poll}>
            {options.map((o, i) => (
              <input key={i} className={styles.input} value={o} maxLength={community.MAX_OPTION_CHARS} aria-label={format(t.option ?? '', { n: i + 1 })}
                placeholder={format(t.option ?? '', { n: i + 1 })} onChange={(e) => setOptions((all) => all.map((x, j) => (j === i ? e.target.value : x)))} />
            ))}
            {options.length < community.MAX_POLL_OPTIONS ? <button type="button" className={styles.addBtn} onClick={() => setOptions((all) => [...all, ''])}>{t.addOption}</button> : null}
            <div className={styles.dur} role="group" aria-label={t.pollLength}>
              {t.pollLength}
              {DAYS.map((d) => <Pill key={d} selected={d === days} onClick={() => setDays(d)}>{plural(t, 'day', d, locale)}</Pill>)}
            </div>
          </div>
        ) : null}

        <div className={styles.attach}>
          <div className={styles.attachRow} role="group" aria-label={t.attach}>
            <span className={styles.attachLabel}>{t.attach}</span>
            {KINDS.map((k) => <Pill key={k} selected={picking === k || attachment?.kind === k} onClick={() => togglePick(k)}>{t[`kind_${k}`]}</Pill>)}
          </div>
          {picking ? (
            <div className={styles.pick} role="group" aria-label={format(t.choose ?? '', { kind: t[`kind_${picking}`] ?? '' })}>
              {choices.map((a) => (
                <button key={a.id} type="button" className={styles.pickItem} onClick={() => { setAttachment(a); setPicking(null); }}>
                  <AttachmentIcon a={a} /><span><b>{a.title}</b><small>{a.subtitle}</small></span>
                </button>
              ))}
            </div>
          ) : null}
          {attachment ? (
            <div className={styles.chosen}>
              <AttachmentIcon a={attachment} />
              <span><b>{attachment.title}</b><small>{attachment.subtitle}</small></span>
              <button type="button" className={styles.rm} aria-label={t.remove} onClick={() => setAttachment(null)}><CloseIcon /></button>
            </div>
          ) : null}
          {attachment?.kind === 'deal' ? <p className={styles.note} style={{ marginTop: 10 }}>{t.dealWarning}</p> : null}
        </div>

        {errors.includes('returnPromise') ? <p className={styles.alert} role="alert">{t.promiseBlocked}</p> : null}
        {status === 'failed' ? <p className={styles.alert} role="alert">{t.failed}</p> : null}
        {status === 'promise' ? <p className={styles.alert} role="alert">{t.failedPromise}</p> : null}
        {SAMPLE_MODE ? <p className={styles.note}>{t.sampleNote}</p> : null}
      </main>
    </>
  );
}
