// ─── Zone summary cards ────────────────────────────────────────────────────
const ZONE_CARDS = [
  {
    label: 'Zone GMV today',
    value: '₹2.4L',
    sub: 'Online ₹64K · In-store ₹1.76L',
    delta: '↑ 8.3% vs last week',
    deltaClass: 'delta-up',
    highlight: true,
  },
  {
    label: 'Zone MTD',
    value: '₹23.1L',
    sub: 'Target: ₹27L · 86% achieved',
    delta: '12 days remaining',
    deltaClass: 'delta-warn',
  },
  {
    label: 'Actionable signals',
    value: '28',
    sub: '11 high priority today',
    delta: '4 expiring in <2h',
    deltaClass: 'delta-down',
  },
  {
    label: 'Outreach sent MTD',
    value: '47',
    sub: '6 visits attributed · ₹19,800 GMV',
    delta: '12.8% conv. rate',
    deltaClass: 'delta-up',
  },
];

// ─── Buckets ───────────────────────────────────────────────────────────────
const BUCKETS = [
  {
    id: 'dropoff',
    icon: 'ti-shopping-cart-x',
    iconBg: '#FEF2F2',
    iconColor: '#B91C1C',
    title: 'Drop-offs',
    todayCount: 11,
    todayPri: 'high',
    signals: [
      { id: 'payment_drop', name: 'Payment drop-off', meta: 'Reached payment page, did not complete', count: 3, pri: 'high' },
      { id: 'cart_abandon', name: 'Cart abandonment', meta: 'Added to cart, left without checkout', count: 6, pri: 'high' },
      { id: 'pdp_repeat', name: 'Repeat PDP views (3+)', meta: 'Multiple PDP visits, no cart add', count: 8, pri: 'med' },
      { id: 'wishlist', name: 'Wishlist — no purchase', meta: 'Saved 7+ days ago, no action taken', count: 5, pri: 'low' },
    ],
  },
  {
    id: 'returns',
    icon: 'ti-arrow-back-up',
    iconBg: '#FFFBEB',
    iconColor: '#92400E',
    title: 'Returns & exchanges',
    todayCount: 5,
    todayPri: 'med',
    signals: [
      { id: 'fit_issue', name: 'Fit issue', meta: 'Frame too loose, tight, or uncomfortable', count: 2, pri: 'high' },
      { id: 'power_issue', name: 'Power mismatch', meta: 'Wrong power, blurry vision, headache', count: 1, pri: 'high' },
      { id: 'quality_issue', name: 'Quality defect', meta: 'Scratched lens, bent frame, coating issue', count: 1, pri: 'med' },
      { id: 'changed_mind', name: 'Changed mind', meta: 'No longer needed or gift return', count: 1, pri: 'low' },
    ],
  },
  {
    id: 'membership',
    icon: 'ti-award',
    iconBg: '#FFFBEB',
    iconColor: '#92400E',
    title: 'Membership',
    todayCount: 7,
    todayPri: 'med',
    signals: [
      { id: 'gold_expiry', name: 'Gold expiry < 30 days', meta: 'Membership ending soon, may be unaware', count: 2, pri: 'high' },
      { id: 'gold_low_use', name: 'Gold — low utilisation', meta: 'Fewer than 2 benefits used in 90 days', count: 3, pri: 'med' },
      { id: 'gold_new', name: 'New Gold — no purchase', meta: 'Signed up, no first purchase in 30 days', count: 1, pri: 'high' },
      { id: 'non_gold_upgrade', name: 'Non-Gold high LTV', meta: 'Spent ₹8K+ but not a Gold member', count: 3, pri: 'med' },
    ],
  },
  {
    id: 'retention',
    icon: 'ti-repeat',
    iconBg: '#F0FDF4',
    iconColor: '#15803D',
    title: 'Retention & cross-sell',
    todayCount: 5,
    todayPri: 'low',
    signals: [
      { id: 'lapsed_frames', name: 'Lapsed — frames (6m+)', meta: 'Bought frames, inactive 6+ months', count: 8, pri: 'high' },
      { id: 'lapsed_lenses', name: 'Lapsed — contact lenses', meta: 'Lens buyer inactive 45+ days', count: 5, pri: 'high' },
      { id: 'crosssell_sun', name: 'Cross-sell — sunglasses', meta: 'No sunglasses in profile, powered buyer', count: 4, pri: 'med' },
      { id: 'second_pair', name: 'Second pair nudge', meta: 'Single frame buyer, 12 months+', count: 6, pri: 'med' },
      { id: 'winback', name: 'Post-return win-back', meta: 'Return completed 25–35 days ago', count: 2, pri: 'med' },
    ],
  },
];

// ─── Customers per signal ──────────────────────────────────────────────────
const CUSTOMERS = {
  payment_drop: [
    { initials: 'AK', name: 'Arjun Kulkarni', phone: 'XXXXXX7821', gold: true, affluence: 'High', ltv: '₹12,400', signal: 'Dropped at payment · Cart: ₹4,200', frame: 'Ray-Ban RB3025 Aviator', age: '2h ago', tags: ['gold', 'high'], returnFlag: false },
    { initials: 'SM', name: 'Sneha Mehta', phone: 'XXXXXX3342', gold: false, affluence: 'High', ltv: '₹6,800', signal: 'Dropped at payment · Cart: ₹2,800', frame: 'Lenskart Blue Cut Pro', age: '1.5h ago', tags: ['high'], returnFlag: false },
    { initials: 'RT', name: 'Rahul Tiwari', phone: 'XXXXXX9901', gold: true, affluence: 'Medium', ltv: '₹9,100', signal: 'Dropped at payment · Cart: ₹3,600', frame: 'Oakley Holbrook Mix', age: '3h ago', tags: ['gold'], returnFlag: false },
  ],
  cart_abandon: [
    { initials: 'PV', name: 'Priya Venkat', phone: 'XXXXXX2210', gold: false, affluence: 'Medium', ltv: '₹3,200', signal: 'Cart abandoned · ₹1,900 · 48 min ago', frame: 'Fastrack Oval Frame', age: '48m ago', tags: [], returnFlag: false },
    { initials: 'KR', name: 'Karthik Rao', phone: 'XXXXXX5567', gold: true, affluence: 'High', ltv: '₹18,500', signal: 'Cart abandoned · ₹5,400 · 1h ago', frame: 'Persol PO3019S', age: '1h ago', tags: ['gold', 'high'], returnFlag: false },
    { initials: 'ND', name: 'Nisha Desai', phone: 'XXXXXX7734', gold: false, affluence: 'Standard', ltv: '₹1,400', signal: 'Cart abandoned · ₹1,400 · 2h ago', frame: 'Vincent Chase WireFrame', age: '2h ago', tags: [], returnFlag: false },
  ],
  pdp_repeat: [
    { initials: 'VB', name: 'Vikram Bhat', phone: 'XXXXXX4423', gold: false, affluence: 'High', ltv: '₹5,600', signal: '5 PDP views on same frame in 3 days', frame: 'Maui Jim Polarised Sunglasses', age: 'Today', tags: ['high'], returnFlag: false },
  ],
  wishlist: [
    { initials: 'AS', name: 'Ananya Shah', phone: 'XXXXXX8812', gold: true, affluence: 'Medium', ltv: '₹7,200', signal: 'Wishlisted 9 days ago, no action', frame: 'Ted Baker London TB001', age: '9d ago', tags: ['gold'], returnFlag: false },
  ],
  fit_issue: [
    { initials: 'MK', name: 'Meera Krishnan', phone: 'XXXXXX6612', gold: false, affluence: 'Medium', ltv: '₹4,200', signal: 'Return initiated: frame too loose', frame: 'Lenskart Rimless LS-E3210', age: 'Today', tags: ['return'], returnFlag: true },
    { initials: 'SG', name: 'Suresh Gupta', phone: 'XXXXXX1190', gold: true, affluence: 'High', ltv: '₹11,300', signal: 'Return initiated: nose pad discomfort', frame: 'Ray-Ban RX5228', age: 'Today', tags: ['gold', 'return'], returnFlag: true },
  ],
  power_issue: [
    { initials: 'DP', name: 'Divya Pillai', phone: 'XXXXXX3381', gold: false, affluence: 'Standard', ltv: '₹2,800', signal: 'Return: blurry vision at distance', frame: 'Lenskart Blu+', age: 'Yesterday', tags: ['return'], returnFlag: true },
  ],
  quality_issue: [
    { initials: 'AT', name: 'Atul Thakur', phone: 'XXXXXX7723', gold: false, affluence: 'Medium', ltv: '₹3,400', signal: 'Return: lens scratched on delivery', frame: 'Fastrack FR Blue Cut', age: '2d ago', tags: ['return'], returnFlag: true },
  ],
  changed_mind: [
    { initials: 'RN', name: 'Rohini Nair', phone: 'XXXXXX5541', gold: false, affluence: 'Standard', ltv: '₹1,500', signal: 'Return: no longer needed', frame: 'Vincent Chase VC-6584', age: '3d ago', tags: [], returnFlag: true },
  ],
  gold_expiry: [
    { initials: 'HP', name: 'Harish Patel', phone: 'XXXXXX2298', gold: true, affluence: 'High', ltv: '₹15,600', signal: 'Gold expires in 18 days', frame: '—', age: 'Expiry: 29 May', tags: ['gold', 'high'], returnFlag: false },
    { initials: 'SR', name: 'Sunita Reddy', phone: 'XXXXXX8843', gold: true, affluence: 'Medium', ltv: '₹8,900', signal: 'Gold expires in 24 days', frame: '—', age: 'Expiry: 4 Jun', tags: ['gold'], returnFlag: false },
  ],
  gold_low_use: [
    { initials: 'JM', name: 'Jayesh Modi', phone: 'XXXXXX4411', gold: true, affluence: 'Medium', ltv: '₹6,200', signal: '0 of 3 benefits used this year', frame: '—', age: 'Joined: Jan 2026', tags: ['gold'], returnFlag: false },
  ],
  gold_new: [
    { initials: 'PR', name: 'Pooja Rao', phone: 'XXXXXX9920', gold: true, affluence: 'High', ltv: '₹0', signal: 'Gold member since 14 Apr — no purchase yet', frame: '—', age: '27 days idle', tags: ['gold', 'new', 'high'], returnFlag: false },
  ],
  non_gold_upgrade: [
    { initials: 'VK', name: 'Vineet Kumar', phone: 'XXXXXX3367', gold: false, affluence: 'High', ltv: '₹9,800', signal: '3 orders — never upgraded to Gold', frame: '—', age: 'Last: 8 Mar', tags: ['high'], returnFlag: false },
  ],
  lapsed_frames: [
    { initials: 'NK', name: 'Nikhil Kapoor', phone: 'XXXXXX7781', gold: false, affluence: 'High', ltv: '₹5,400', signal: 'Last purchase: Ray-Ban Wayfarer · 7 months ago', frame: 'Ray-Ban RB2140', age: '7m ago', tags: ['lapsed', 'high'], returnFlag: false },
    { initials: 'TJ', name: 'Tanvi Joshi', phone: 'XXXXXX2256', gold: true, affluence: 'Medium', ltv: '₹7,800', signal: 'Last purchase: Lenskart Air · 8 months ago', frame: 'Lenskart Air LA-E1940', age: '8m ago', tags: ['gold', 'lapsed'], returnFlag: false },
  ],
  lapsed_lenses: [
    { initials: 'RS', name: 'Rohan Shetty', phone: 'XXXXXX9934', gold: false, affluence: 'Standard', ltv: '₹3,100', signal: 'Contact lens reorder due · Acuvue Oasys', frame: 'Acuvue Oasys 2-week', age: '52d ago', tags: ['lapsed'], returnFlag: false },
  ],
  crosssell_sun: [
    { initials: 'AM', name: 'Aditi Menon', phone: 'XXXXXX6623', gold: true, affluence: 'High', ltv: '₹11,200', signal: 'Powered frames buyer — no sunglasses in profile', frame: '—', age: 'Opp: powered sunglasses', tags: ['gold', 'high'], returnFlag: false },
  ],
  second_pair: [
    { initials: 'BK', name: 'Bhavesh Kalra', phone: 'XXXXXX3390', gold: false, affluence: 'Medium', ltv: '₹3,300', signal: 'Single purchase · 14 months ago', frame: '—', age: '14m ago', tags: ['lapsed'], returnFlag: false },
  ],
  winback: [
    { initials: 'CM', name: 'Charu Malik', phone: 'XXXXXX5512', gold: false, affluence: 'Standard', ltv: '₹2,800', signal: 'Completed return 28 days ago', frame: '—', age: '28d post-return', tags: [], returnFlag: false },
  ],
};

// ─── WA Templates per signal ───────────────────────────────────────────────
const TEMPLATES = {
  payment_drop: [
    {
      name: 'Cart recovery — frame specific',
      preview: 'Hi [Name], you were so close! Your [Frame] is still waiting...',
      full: `Hi [Name], you were so close! Your [Frame] is still waiting.

Complete your order here 👉 [link]

Or come try it on at our Koramangala store today — we'd love to help you find your perfect fit.

— Lenskart Koramangala`,
    },
    {
      name: 'Store visit nudge',
      preview: 'Hi [Name], we noticed you were checking out [Frame]...',
      full: `Hi [Name], we noticed you were checking out [Frame] on Lenskart.

That style is available right here at our Koramangala store. Come try it on — no pressure, just a great fit.

Book a slot: [link] or just walk in!

— Lenskart Koramangala`,
    },
  ],
  cart_abandon: [
    {
      name: 'Frame-specific recovery',
      preview: 'Hi [Name], spotted you checking out [Frame] — great choice!',
      full: `Hi [Name], spotted you checking out [Frame] — great choice!

Still available at our Koramangala store. Want to try before you buy?

Book a free try-on here 👉 [link]
Or complete your order: [cart link]

— Lenskart Koramangala`,
    },
    {
      name: 'Limited stock nudge',
      preview: 'Hi [Name], just a heads-up — [Frame] is selling fast.',
      full: `Hi [Name], just a heads up — [Frame] is selling fast and stock is limited at our Koramangala store.

Don't miss out! Complete your order: [link]
Or walk in today and we'll hold a pair for you.

— Lenskart Koramangala`,
    },
  ],
  pdp_repeat: [
    {
      name: 'In-store try-on invite',
      preview: 'Hi [Name], we noticed you\'ve been eyeing the [Frame]...',
      full: `Hi [Name], we noticed you've been checking out [Frame] a few times — it's a great pick!

It's available at our Koramangala store right now. Shall we reserve one for a free try-on?

Book here: [link]

— Lenskart Koramangala`,
    },
  ],
  wishlist: [
    {
      name: 'Stock availability nudge',
      preview: 'Hi [Name], your saved [Frame] is available at our store.',
      full: `Hi [Name], your saved [Frame] is now available at our Koramangala store.

Limited pairs available — want us to hold one for you? Book a slot: [link]

— Lenskart Koramangala`,
    },
  ],
  fit_issue: [
    {
      name: 'Free adjustment offer',
      preview: 'Hi [Name], before we process your return — we can fix the fit for free.',
      full: `Hi [Name], I saw you've raised a return on your [Frame] — before we process it, I wanted to reach out personally.

Our Koramangala team can adjust the fit for free, right here in the store. Most fit issues are sorted in under 10 minutes.

Can you come in today?

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  power_issue: [
    {
      name: 'Free eye recheck offer',
      preview: 'Hi [Name], sorry about the vision issue — free recheck on us.',
      full: `Hi [Name], sorry to hear about the vision issue with your [Frame].

Our Koramangala store can do a free eye recheck and sort this out for you — it takes just 20 minutes and we'll make sure your lenses are right.

Book here: [eye test link]
Or walk in anytime.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  quality_issue: [
    {
      name: 'In-store inspection & replacement',
      preview: 'Hi [Name], sorry about the issue — come in and we\'ll make it right.',
      full: `Hi [Name], we're sorry about the issue with your [Frame].

Our Koramangala team would love to inspect it in person and replace it for you — no paperwork, no hassle.

Come in at your convenience.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  changed_mind: [
    {
      name: 'Soft exchange offer',
      preview: 'Hi [Name], we understand — let us help you find the right fit first.',
      full: `Hi [Name], we completely understand!

If you'd like to explore other styles before making a final decision, we're happy to help at our Koramangala store — no pressure at all.

Or if you'd prefer an exchange over a return, we'll take care of it: [link]

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  gold_expiry: [
    {
      name: 'Gold renewal nudge',
      preview: 'Hi [Name], your Gold membership expires on [Date] — don\'t lose your benefits!',
      full: `Hi [Name], your Lenskart Gold membership expires on [Date].

As a Gold member, you get free eye tests, priority service, and exclusive offers at our Koramangala store — don't let that lapse!

Renew in 2 taps: [renewal link]
Or walk in and we'll sort it out for you.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  gold_low_use: [
    {
      name: 'Unused benefit highlight',
      preview: 'Hi [Name], your free eye test is sitting unused — book it today!',
      full: `Hi [Name], as a Gold member you get a free eye test every 6 months — and yours hasn't been used yet!

Book it at our Koramangala store here: [eye test link]
It takes just 20 minutes and we'll check your current power too.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  gold_new: [
    {
      name: 'Welcome + free styling session',
      preview: 'Hi [Name], welcome to Gold! Your first perk: a free styling session.',
      full: `Hi [Name], welcome to Lenskart Gold! 🎉

Your first perk is waiting — a complimentary styling session at our Koramangala store. Our team would love to help you find your signature look.

Book here: [booking link]
Or just walk in and ask for Ravi.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  non_gold_upgrade: [
    {
      name: 'Gold upgrade pitch',
      preview: 'Hi [Name], did you know Gold members save ₹1,200/year on average?',
      full: `Hi [Name], you've been a valued Lenskart customer and we wanted to let you know about Gold.

Gold members save an average of ₹1,200 per year — free eye tests, priority service, exclusive discounts.

Upgrade here: [Gold link]
Or ask us at the Koramangala store — we'll walk you through it.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  lapsed_frames: [
    {
      name: 'New collection nudge',
      preview: 'Hi [Name], it\'s been a while! New [Brand] styles just arrived.',
      full: `Hi [Name], it's been a while — we miss you at Lenskart!

We've just received new [Brand] styles at our Koramangala store, and your power may be due for a recheck too.

Book a free eye test: [eye test link]
Or come explore the new collection anytime.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  lapsed_lenses: [
    {
      name: 'Contact lens reorder reminder',
      preview: 'Hi [Name], running low on [Brand] lenses? Reorder in 2 taps.',
      full: `Hi [Name], it's been a while since your last [Brand] lens order — you might be running low!

Reorder in 2 taps — your prescription is saved: [reorder link]

Or subscribe and never run out again. Questions? Call us at Koramangala.

— Lenskart Koramangala`,
    },
  ],
  crosssell_sun: [
    {
      name: 'Powered sunglasses pitch',
      preview: 'Hi [Name], did you know we make sunglasses in your power too?',
      full: `Hi [Name], did you know we make sunglasses in your exact power? Perfect for driving, travel, or just the Bengaluru sun.

Come try them at our Koramangala store or explore here: [collection link]

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  second_pair: [
    {
      name: 'Second pair lifestyle nudge',
      preview: 'Hi [Name], most customers have a second pair — one for work, one for weekends.',
      full: `Hi [Name], most of our customers have a second pair — one for work, one for weekends.

Your style suggests you'd love [Frame Category]. Come try them at Koramangala: [link]

We'll help you find the perfect complement to what you already have.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
  winback: [
    {
      name: 'Soft win-back offer',
      preview: 'Hi [Name], we hope we can do better for you — new arrivals just in!',
      full: `Hi [Name], we hope we can do better for you this time!

We have new arrivals that might be a better fit — no pressure, just come explore at Koramangala or browse here: [collection link]

We'd love to make it right.

— Ravi, Store Manager, Lenskart Koramangala`,
    },
  ],
};

const ASSOCIATES = ['Preethi S.', 'Mohammed A.', 'Lakshmi R.', 'Suraj D.'];
