'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Deal } from '@meridian/contracts';
import { deals } from '@meridian/domain';
import { format } from '@meridian/i18n';
import { Button, ErrorState, Pill, RiskNotice, buttonClass } from '@meridian/ui';
import { api } from '@/lib/api';
import { capitalHref, dealHref, usd } from '@/lib/capital';
import { SAMPLE_MODE } from '@/lib/sample';
import { addSampleInvestment } from '@/lib/sampleStore';
import { PageBar } from '@/components/shell/PageBar';
import { amountError, amountMinor, canLeaveAmount, canLeavePayment, failureOf, initialState, PROVIDERS, reduce, type Action, type State } from '../state';
import styles from './Invest.module.css';

interface Props { locale: string; nl: string; deal: Deal; startDollars: number; t: Record<string, string> }

const QUICK = [100, 250, 500, 1000];

export function InvestFlow({ locale, nl, deal, startDollars, t }: Props) {
  const router = useRouter();
  const [s, dispatch] = useReducer((st: State, a: Action) => reduce(st, a, deal.minInvestMinor), initialState(startDollars));
  const [touchedPhone, setTouchedPhone] = useState(false);
  const sending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Move focus to the new screen's heading so keyboard and screen reader users land at the top of each step.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    heading.current?.focus();
  }, [s.step]);

  const cents = amountMinor(s);
  const fee = deals.feeMinor(cents);
  const total = cents + fee;
  const err = amountError(s, deal.minInvestMinor);
  const showErr = s.amountText !== '' ? err : s.step === 'amount' ? err : null;
  const phoneBad = s.method === 'momo' && s.phone.trim() !== '' && !deals.isGhanaMomoNumber(s.phone) && (touchedPhone || s.phone.replace(/\s/g, '').length >= 10);
  const min = usd(deal.minInvestMinor, nl);
  const stepNo = s.step === 'amount' ? 1 : s.step === 'payment' ? 2 : 3;

  const submit = async () => {
    if (sending.current || s.step !== 'confirm') return;
    sending.current = true;
    dispatch({ type: 'submit' });
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) { dispatch({ type: 'failed', failure: 'offline' }); return; }
      const receipt = await api.capital.commit({
        dealId: deal.id, amountMinor: cents, method: s.method ?? 'card', acknowledged: true,
        ...(s.method === 'momo' ? { provider: s.provider as (typeof PROVIDERS)[number], phone: s.phone } : {}),
      });
      if (SAMPLE_MODE) addSampleInvestment(receipt);
      dispatch({ type: 'succeeded', receipt });
    } catch (e) {
      dispatch({ type: 'failed', failure: failureOf(e, typeof navigator === 'undefined' ? true : navigator.onLine) });
    } finally {
      sending.current = false;
    }
  };

  const onBack = s.step === 'amount' || s.step === 'done' || s.step === 'failed'
    ? () => router.push(s.step === 'done' ? capitalHref(locale) : dealHref(locale, deal.id))
    : () => dispatch({ type: 'back' });

  const methodLabel = s.method === 'momo' ? `${t.method_momo}, ${s.provider ?? ''} ${s.phone}`.trim() : s.method === 'card' ? t.cardWord : s.method === 'bank' ? t.bankWord : '';
  const bar = <PageBar title={format(t.investIn ?? '', { name: deal.name })} backLabel={t.back ?? ''} fallbackHref={dealHref(locale, deal.id)} onBack={onBack} backDisabled={s.step === 'processing'} />;

  if (s.step === 'processing') {
    return (
      <>
        {bar}
        <main className={styles.wrap}>
          <div className={styles.center} role="status">
            <div className={styles.spin} aria-hidden="true" />
            <h1 ref={heading} tabIndex={-1}>{s.method === 'momo' ? t.procMomoTitle : t.procTitle}</h1>
            <p>{s.method === 'momo' ? t.procMomoBody : t.procBody}</p>
          </div>
        </main>
      </>
    );
  }

  if (s.step === 'done' && s.receipt) {
    const r = s.receipt;
    return (
      <>
        {bar}
        <main className={styles.wrap}>
          <div className={styles.center}>
            <h1 ref={heading} tabIndex={-1}>{t.doneTitle}</h1>
            <p>{format(t.doneBody ?? '', { amount: usd(r.amountMinor, nl), name: deal.name })}</p>
            <p className={styles.ref}>{format(t.reference ?? '', { ref: r.ref })}</p>
          </div>
          <dl className={styles.dl}>
            <div><dt>{t.amount}</dt><dd>{usd(r.amountMinor, nl)}</dd></div>
            <div><dt>{format(t.fee ?? '', { pct: 2 })}</dt><dd>{usd(r.feeMinor, nl)}</dd></div>
            <div><dt>{t.total}</dt><dd>{usd(r.amountMinor + r.feeMinor, nl)}</dd></div>
          </dl>
          <div className={styles.btns}>
            <Link href={`/${locale}/portfolio`} className={`${buttonClass('go', true)} ${styles.link}`}>{t.viewPortfolio}</Link>
            <Link href={capitalHref(locale)} className={`${buttonClass('outline', true)} ${styles.link}`}>{t.backToCapital}</Link>
          </div>
          <p className={styles.note}>{t.sampleDone}</p>
        </main>
      </>
    );
  }

  if (s.step === 'failed') {
    const k = s.failure ?? 'error';
    const title = k === 'declined' ? t.failTitle : k === 'offline' ? t.offlineTitle : t.errorTitle;
    const body = k === 'declined' ? t.failBody : k === 'offline' ? t.offlineBody : t.errorBody;
    return (
      <>
        {bar}
        <main className={styles.wrap}>
          <div className={styles.gap}>
            <ErrorState title={title ?? ''} action={
              <div className={styles.btns} style={{ width: '100%' }}>
                <Button variant="go" full onClick={() => dispatch({ type: 'retry' })}>{t.tryAgain}</Button>
                <Button variant="outline" full onClick={() => dispatch({ type: 'changeMethod' })}>{t.changeMethod}</Button>
              </div>
            }>{body}</ErrorState>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {bar}
      <main className={styles.wrap}>
        <p className={styles.step}>{format(t.steps ?? '', { n: stepNo })}</p>

        {s.step === 'amount' ? (
          <>
            <h1 className={styles.h1} ref={heading} tabIndex={-1}>{format(t.investIn ?? '', { name: deal.name })}</h1>
            <p className={styles.lead}>{t.chooseAmount}</p>
            <label className={styles.amount}>
              <span aria-hidden="true">$</span>
              <input inputMode="numeric" autoComplete="off" aria-label={t.amountLabel} aria-invalid={showErr ? true : undefined} aria-describedby={showErr ? 'amt-err' : undefined} value={s.amountText} onChange={(e) => dispatch({ type: 'amount', text: e.target.value })} />
            </label>
            {showErr ? <p className={styles.err} id="amt-err" role="alert">{showErr === 'tooLow' ? format(t.atLeast ?? '', { min }) : format(t.atMost ?? '', { max: usd(deals.MAX_COMMIT_MINOR, nl) })}</p> : null}
            <div className={styles.chips} role="group" aria-label={t.quickAmounts}>
              {QUICK.filter((a) => a * 100 >= deal.minInvestMinor).map((a) => <Pill key={a} selected={cents === a * 100} onClick={() => dispatch({ type: 'amount', text: String(a) })}>{usd(a * 100, nl)}</Pill>)}
            </div>
            <dl className={styles.dl}>
              <div><dt>{t.instrument}</dt><dd>{deal.instrument}</dd></div>
              <div><dt>{t.cap}</dt><dd>{usd(deal.valuationCapMinor, nl)}</dd></div>
              <div><dt>{format(t.fee ?? '', { pct: 2 })}</dt><dd>{usd(fee, nl)}</dd></div>
              <div><dt>{t.total}</dt><dd>{usd(total, nl)}</dd></div>
            </dl>
            <fieldset className={styles.acks}>
              <legend>{t.beforeContinue}</legend>
              {(['ack1', 'ack2', 'ack3'] as const).map((k, i) => (
                <label key={k} className={styles.check}>
                  <input type="checkbox" checked={s.acks[i] ?? false} onChange={() => dispatch({ type: 'ack', index: i as 0 | 1 | 2 })} />
                  <span>{t[k]}</span>
                </label>
              ))}
            </fieldset>
            <div className={styles.gap}><RiskNotice title={t.riskTitle ?? ''}>{t.riskBody}</RiskNotice></div>
            <div className={styles.cta}><Button variant="go" full disabled={!canLeaveAmount(s, deal.minInvestMinor)} onClick={() => dispatch({ type: 'next' })}>{t.continue}</Button></div>
            <p className={styles.note}>{t.flowNote}</p>
          </>
        ) : null}

        {s.step === 'payment' ? (
          <>
            <h1 className={styles.h1} ref={heading} tabIndex={-1}>{t.payTitle}</h1>
            <p className={styles.lead}>{format(t.totalToday ?? '', { amount: usd(total, nl) })}</p>
            <fieldset className={styles.opts}>
              <legend>{t.methodGroup}</legend>
              {(['momo', 'card', 'bank'] as const).map((m) => (
                <label key={m} className={styles.opt}>
                  <input type="radio" name="method" checked={s.method === m} onChange={() => dispatch({ type: 'method', method: m })} />
                  <span><b>{t[`method_${m}`]}</b><small>{t[`method_${m}_sub`]}</small></span>
                </label>
              ))}
            </fieldset>
            {s.method === 'momo' ? (
              <div className={styles.momo}>
                <h2 id="prov-h">{t.provider}</h2>
                <div className={styles.provs} role="group" aria-labelledby="prov-h">
                  {PROVIDERS.map((p) => <Pill key={p} selected={s.provider === p} onClick={() => dispatch({ type: 'provider', provider: p })}>{p}</Pill>)}
                </div>
                <div className={styles.phone}>
                  <label>
                    <span>{t.momoNumber}</span>
                    <input type="tel" inputMode="tel" autoComplete="tel" placeholder={t.momoPlaceholder} aria-invalid={phoneBad ? true : undefined} aria-describedby={phoneBad ? 'phone-err' : undefined} value={s.phone} onBlur={() => setTouchedPhone(true)} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />
                  </label>
                  {phoneBad ? <p className={styles.err} id="phone-err" role="alert">{t.momoInvalid}</p> : null}
                  {SAMPLE_MODE ? <p className={styles.hintSmall}>{t.declineHint}</p> : null}
                </div>
              </div>
            ) : null}
            <div className={styles.cta}><Button variant="go" full disabled={!canLeavePayment(s)} onClick={() => dispatch({ type: 'next' })}>{t.continue}</Button></div>
            <p className={styles.note}>{t.flowNote}</p>
          </>
        ) : null}

        {s.step === 'confirm' ? (
          <>
            <h1 className={styles.h1} ref={heading} tabIndex={-1}>{t.confirmTitle}</h1>
            <p className={styles.lead}>{t.confirmLead}</p>
            <dl className={styles.dl}>
              <div><dt>{t.round}</dt><dd>{deal.name}</dd></div>
              <div><dt>{t.amount}</dt><dd>{usd(cents, nl)}</dd></div>
              <div><dt>{format(t.fee ?? '', { pct: 2 })}</dt><dd>{usd(fee, nl)}</dd></div>
              <div><dt>{t.payWith}</dt><dd>{methodLabel}</dd></div>
              <div><dt>{t.total}</dt><dd>{usd(total, nl)}</dd></div>
            </dl>
            <div className={styles.gap}><RiskNotice title={t.riskTitle ?? ''}>{t.riskBody}</RiskNotice></div>
            <div className={styles.cta}><Button variant="go" full onClick={submit}>{format(t.confirmPay ?? '', { amount: usd(total, nl) })}</Button></div>
            <p className={styles.note}>{t.terms}</p>
            <p className={styles.note}>{t.flowNote}</p>
          </>
        ) : null}
      </main>
    </>
  );
}
