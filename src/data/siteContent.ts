export type StoryImage = {
  src: string
  alt: string
  label: string
}

export type Experience = {
  id: string
  title: string
  englishTitle: string
  body: string[]
  annotation?: string
  keywords?: string[]
  images: StoryImage[]
  tone: 'opening' | 'fast' | 'quiet' | 'launch' | 'climax' | 'closing'
}

export type MeaningChapter = {
  id: string
  title: string
  englishTitle: string
  body: string[]
  statement: string
}

export type PlanChapter = {
  id: string
  title: string
  englishTitle: string
  body: string[]
  statement: string
  notes?: string[]
}

export const siteMeta = {
  name: '[NAME]',
  role: 'External Relations',
  englishRole: 'External Relations · Deputy Head Candidate',
}

export const heroContent = {
  eyebrow: 'UNSWCSA / 2026',
  campus: 'UNSW · KENSINGTON',
  candidacy: 'Deputy Head Candidate',
  signature: 'Eddy 盛世禾',
}

export const aboutContent = {
  eyebrow: '01 / PERSONAL INTRODUCTION',
  title: '个人简介',
  englishTitle: 'A little about me.',
  body: [
    '我是一名软件工程专业的大二学生。专业上，我比较喜欢“边做边学”。除了课程学习之外，也会主动参加一些项目和比赛，比如字节全栈挑战赛、安克创新黑客松。',
    '对我来说，参加这些活动不只是为了多一段经历，更重要的是能真正和团队一起做东西、解决问题，把脑子里的想法一点点落地。',
    '平时我很喜欢运动，尤其是打羽毛球；也喜欢音乐，会弹一点钢琴、吹口琴。相比一直待在自己的舒适区里，我更喜欢尝试新东西、认识不同的人，也很享受和大家一起讨论、合作的过程。',
  ],
  labels: [
    'Software Engineering',
    'learning by doing',
    'ByteDance Full-Stack Challenge',
    'Anker Hackathon',
    'Badminton',
    'Piano',
    'Harmonica',
  ],
  note: 'curious by default',
}

export const journeyIntro = {
  eyebrow: '02 / MY JOURNEY',
  title: '我与外联',
  englishTitle: 'Somewhere between every event, I found my place here.',
  body: '比起把它们写成一条条经历，我更愿意把这些活动理解成我和外联共同经历过的一些瞬间。',
}

export const experiences: Experience[] = [
  {
    id: '01',
    title: '端午节',
    englishTitle: 'Dragon Boat Festival',
    body: ['第一次真正走进外联的活动现场，也是在这里开始理解：一场活动最终呈现出来的热闹，背后其实是很多细节共同完成的。'],
    annotation: 'the beginning',
    images: [
      { src: '/images/dragon-boat-01.jpg', alt: '端午节活动照片一', label: 'DRAGON BOAT / 01' },
      { src: '/images/dragon-boat-02.jpg', alt: '端午节活动照片二', label: 'DRAGON BOAT / 02' },
    ],
    tone: 'opening',
  },
  {
    id: '02',
    title: '全员加速中',
    englishTitle: 'Run together.',
    body: ['相比单纯完成自己的任务，这次活动让我更明显地感受到团队之间的配合。现场节奏很快，每个人都需要知道自己什么时候出现、什么时候补位。'],
    keywords: ['coordination', 'reaction', 'teamwork'],
    images: [
      { src: '/images/run-together-01.jpg', alt: '全员加速中活动照片一', label: 'RUN TOGETHER / 01' },
      { src: '/images/run-together-02.jpg', alt: '全员加速中活动照片二', label: 'RUN TOGETHER / 02' },
    ],
    tone: 'fast',
  },
  {
    id: '03',
    title: '期末加油包',
    englishTitle: 'A small thing, at the right time.',
    body: [
      '外联并不一定只存在于大型活动里。有时候，一个很小的活动，也能让社团和同学之间产生真正的连接。',
      '这也让我开始意识到，活动的价值不一定取决于规模，而在于它有没有回应大家当下真正需要的东西。',
    ],
    keywords: ['warm', 'small details', 'human connection'],
    images: [
      { src: '/images/finals-kit-01.jpg', alt: '期末加油包活动照片一', label: 'FINALS KIT / 01' },
      { src: '/images/finals-kit-02.jpg', alt: '期末加油包活动照片二', label: 'FINALS KIT / 02' },
    ],
    tone: 'quiet',
  },
  {
    id: '04',
    title: 'Launch Week',
    englishTitle: 'Communication in motion.',
    body: [
      'Launch Week 让我看到，一个活动真正对外呈现时，现场体验、信息传达和整体氛围其实是连在一起的。',
      '外联也不只是“找到资源”，而是在不同的人、信息和需求之间建立连接。',
    ],
    keywords: ['communication', 'presence', 'connection'],
    images: [
      { src: '/images/launch-week-01.jpg', alt: 'Launch Week 活动照片一', label: 'LAUNCH WEEK / 01' },
      { src: '/images/launch-week-02.jpg', alt: 'Launch Week 活动照片二', label: 'LAUNCH WEEK / 02' },
    ],
    tone: 'launch',
  },
  {
    id: '05',
    title: 'Welcome Party',
    englishTitle: 'People make the event.',
    body: [
      'Welcome Party 是我很喜欢的一类活动，因为它让我看到社团最有生命力的一面。',
      '大家从陌生到熟悉，也让我越来越确定：一个好的活动，不只是把流程完成，而是真的创造一个让人愿意留下来的环境。',
    ],
    images: [
      { src: '/images/welcome-party-01.jpg', alt: 'Welcome Party 活动主照片', label: 'WELCOME / 01' },
      { src: '/images/welcome-party-02.jpg', alt: 'Welcome Party 活动照片二', label: 'WELCOME / 02' },
      { src: '/images/welcome-party-03.jpg', alt: 'Welcome Party 活动照片三', label: 'WELCOME / 03' },
    ],
    tone: 'climax',
  },
  {
    id: '06',
    title: '紫金宣讲',
    englishTitle: 'From campus to outside.',
    body: [
      '如果说前面的活动更多让我认识了社团内部的连接，那么宣讲活动让我进一步接触到外联更核心的一面——社团和外部资源之间的连接。',
      '如何沟通、如何理解双方需求、如何让一次合作真正对彼此有价值，是我觉得外联最值得学习的地方。',
    ],
    images: [
      { src: '/images/zijin-talk-01.jpg', alt: '紫金宣讲活动照片', label: 'ZIJIN TALK / 01' },
    ],
    tone: 'closing',
  },
]

export const meaningIntro = {
  eyebrow: '03 / WHAT IT MEANS',
  title: '我理解的外联',
  englishTitle: 'Not just reaching out.',
  body: [
    '经历过这些活动以后，我对外联的理解也慢慢发生了变化。',
    '它当然包括沟通、合作和资源，但我觉得真正重要的，是把人、资源和一场活动需要解决的问题连接起来。',
  ],
}

export const meaningChapters: MeaningChapter[] = [
  {
    id: '01',
    title: '沟通',
    englishTitle: 'Communication',
    body: ['外联首先是沟通，但我理解的沟通并不是单纯“把话说出去”。', '更重要的是知道对方在意什么、我们需要什么，以及如何找到双方都愿意继续合作的交集。'],
    statement: 'Listen first. Then connect.',
  },
  {
    id: '02',
    title: '连接',
    englishTitle: 'Connection',
    body: ['资源本身不会自动变成价值。', '外联真正需要做的，是判断什么资源适合什么活动，再把合适的人、合作方和需求连接起来。'],
    statement: 'The right connection matters more than more connections.',
  },
  {
    id: '03',
    title: '落地',
    englishTitle: 'Execution',
    body: ['一个合作从想法到真正发生，中间还有很多细节。', '确认信息、沟通时间、协调现场、处理变化，这些看起来不显眼的事情，往往决定了一次合作最后是不是顺利。'],
    statement: 'Ideas only matter when they land.',
  },
  {
    id: '04',
    title: '责任',
    englishTitle: 'Responsibility',
    body: ['如果成为副部，我觉得角色会从“完成自己的部分”变成“让整个团队更容易把事情做好”。', '除了做好自己的工作，也需要帮助新人进入状态、承担沟通成本、及时补位，并把经验真正留下来。'],
    statement: 'Make the team better, not just myself busier.',
  },
]

export const futureIntro = {
  eyebrow: "04 / WHAT'S NEXT",
  title: '如果我成为副部',
  englishTitle: 'What I want to build next.',
  body: ['我不希望所谓的规划只是多做几个活动。', '如果有机会成为副部，我更希望把已经做得好的东西继续做好，同时让外联的一些工作变得更清楚、更容易接手，也更容易积累。'],
}

export const plans: PlanChapter[] = [
  {
    id: '01',
    title: '让经验留下来',
    englishTitle: 'Build a shared memory.',
    body: ['很多外联经验其实都存在于人的记忆里。', '谁联系过什么合作方、什么沟通方式有效、活动哪里容易出问题，如果每一次都重新摸索，会浪费很多时间。'],
    statement: "Don't start from zero every time.",
    notes: ['合作方信息', '历史合作情况', '联系方式', '沟通记录', '活动复盘', '注意事项'],
  },
  {
    id: '02',
    title: '让新人更快进入状态',
    englishTitle: 'Make the first step easier.',
    body: ['刚进入外联的时候，很多事情其实并不知道应该怎么开始。', '我希望以后可以把常见的沟通方式、合作流程和活动经验整理得更清楚，让新人不用靠猜，也不用因为第一次做就害怕犯错。'],
    statement: 'We know what to do.',
    notes: ['How do I contact them?', 'What should I say?', 'What happens next?'],
  },
  {
    id: '03',
    title: '让合作更长期',
    englishTitle: 'Think beyond one event.',
    body: ['一次活动结束，不一定意味着一次合作结束。', '如果双方合作体验很好，我希望能够主动维护这些关系，让好的合作慢慢从一次性的联系变成长期的连接。'],
    statement: 'Good relationships compound.',
    notes: ['one event', 'follow up', 'shared value', 'long-term connection'],
  },
  {
    id: '04',
    title: '让外联更有参与感',
    englishTitle: 'Make people want to be here.',
    body: ['我希望外联不仅是一个完成任务的部门，也可以是一个大家愿意一起做事情、愿意表达想法、愿意承担责任的团队。', '如果成为副部，我希望自己既能在需要的时候站出来，也能给其他人足够的空间去尝试。'],
    statement: 'Lead when needed. Step back when possible.',
  },
]

export const transitionContent = {
  title: 'Not a bigger title.',
  secondLine: 'A bigger responsibility.',
  body: ['对我来说，竞选副部不是换一个 title。', '而是希望自己可以承担更多，也让下一次活动、下一次合作、下一届外联，比现在再往前一点。'],
}

export const outroContent = {
  title: '谢谢大家。',
  englishTitle: 'Thanks for scrolling this far.',
  note: 'And thanks for every moment along the way.',
  fragments: [
    { src: '/images/outro-fragment-01.jpg', alt: '', label: 'MEMORY / 01' },
    { src: '/images/outro-fragment-02.jpg', alt: '', label: 'MEMORY / 02' },
    { src: '/images/outro-fragment-03.jpg', alt: '', label: 'MEMORY / 03' },
  ] satisfies StoryImage[],
}
