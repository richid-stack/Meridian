# community

The community feed (For you, Following) and the Groups tab. Prototype source: `screens/community` + p2.
Tabs live in the URL: `?tab=following` or `?tab=groups`.
Shared pieces (PostCard, polls, likes, group joins) live in `apps/web/src/components/community` because Groups and Compose use them too.
In sample mode likes, votes, joins and the person's own posts are saved in this browser (`lib/sampleStore.ts`).
Not built yet: reply threads, reposting, photo, video and voice attachments (they arrive with the uploads module).
