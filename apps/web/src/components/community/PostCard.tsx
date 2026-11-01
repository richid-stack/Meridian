import Link from 'next/link';
import type { Post } from '@meridian/contracts';
import { time } from '@meridian/domain';
import { Avatar } from '@meridian/ui';
import { format } from '@meridian/i18n';
import { AttachmentCard } from './AttachmentCard';
import { CheckIcon } from './icons';
import { PollCard } from './PollCard';
import { PostActions } from './PostActions';
import styles from './Community.module.css';

/** One post. Works on the server and, for the person's own sample posts, in the browser. */
export function PostCard({ post, locale, now, nl, t }: { post: Post; locale: string; now: number; nl: string; t: Record<string, string> }) {
  const a = post.author;
  const own = a.id === 'me';
  const avatar = <Avatar kind="person" name={a.name} size={44} fontSize={18} />;
  return (
    <article className={styles.post}>
      {own ? avatar : <Link href={`/${locale}/people/${a.id}`} className={styles.avLink} aria-label={format(t.viewProfile ?? '', { name: a.name })}>{avatar}</Link>}
      <div className={styles.bd}>
        {post.type !== 'insight' ? <span className={styles.kd}>{t[`kind_${post.type}`]}</span> : null}
        <div className={styles.who}>
          <b>{a.name}</b>
          {a.verified ? <CheckIcon label={t.verified ?? ''} /> : null}
          <time dateTime={post.at}>{time.relativeAgo(Date.parse(post.at), now, locale)}</time>
        </div>
        {a.role ? <div className={styles.role}>{a.role}</div> : null}
        <p className={styles.tx}>{post.text}</p>
        {post.type === 'question' && post.topAnswer ? (
          <div className={styles.ans}><small>{format(t.topAnswer ?? '', { by: post.topAnswer.by })}</small><p>{post.topAnswer.text}</p></div>
        ) : null}
        {post.type === 'poll' ? <PollCard post={post} locale={locale} nl={nl} t={t} /> : null}
        {post.attachment ? <AttachmentCard a={post.attachment} locale={locale} /> : null}
        <PostActions id={post.id} replies={post.replies} reposts={post.reposts} likes={post.likes} likedByMe={post.likedByMe} locale={locale} nl={nl} t={t} />
      </div>
    </article>
  );
}
