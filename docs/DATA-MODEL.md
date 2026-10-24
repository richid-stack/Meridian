# Data model

Source: `apps/api/prisma/schema.prisma`. Core groups: identity (User, Session, KycProfile), entities (Entity, Source, Claim, Correction), community (Group, Post, Upload), capital (Deal, Round, Investment, LedgerEntry), messaging (Thread, Message), news (Story, Article), media (Episode, LiveRoom), platform (Notification, AuditLog).

The schema is a first draft from the prototype. It must be reconciled with the M6 contract before the first migration.
