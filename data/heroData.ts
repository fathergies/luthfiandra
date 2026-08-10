export type HeroPhoto = {
  src: string;
  alt: string;
  caption: string;
  rotation: string;
};

export type PreviewCard = {
  title: string;
  description: string;
  href: string;
  icon: string;
  accent: "pink" | "blue" | "cream";
};

export type LoveStat = {
  label: string;
  value: string;
  note: string;
};

export type LoveNote = {
  title: string;
  text: string;
};

export const heroData = {
  heroVideo: "/assets/hero/hero-video.mov",
  heroPhotos: [
    {
      src: "/assets/hero/photo-01.jpg",
      alt: "A soft placeholder for a favorite photo together",
      caption: "our kind of magic",
      rotation: "-rotate-6"
    },
    {
      src: "/assets/hero/photo-02.jpg",
      alt: "A pink placeholder for a happy memory",
      caption: "you + me",
      rotation: "rotate-3"
    },
    {
      src: "/assets/hero/photo-03.jpg",
      alt: "A cream placeholder for a quiet moment",
      caption: "little moments",
      rotation: "-rotate-2"
    },
    {
      src: "/assets/hero/photo-04.jpg",
      alt: "A blue placeholder for an adventure together",
      caption: "always an adventure",
      rotation: "rotate-6"
    },
    {
      src: "/assets/hero/photo-05.jpg",
      alt: "A romantic placeholder for a treasured memory",
      caption: "my favorite place",
      rotation: "-rotate-3"
    }
  ] satisfies HeroPhoto[],
  openingLetter: {
    greeting: "Happy birthday, my love!",
    paragraphs: [
      "Another year of you. another year of getting to love you.",
      "There were days that felt heavy, moments where you doubted yourself, got tired, and wondered if everything would be okay. but somehow, you still kept going. I'm really proud of you for that, even if you don't always give yourself enough credit.",
      "Makasih yaa sayang selalu ada untuk relationship kita berdua even when i'm not the easiest person to understand. Makasih selalu jadi pendengar yang baik, pacar yang baik, dan orang yang selalu ada buat aku. I know i don't say this enough, but i adore every little thing you do.",
      "I hope this year is kinder to you. Semoga semua hal yang lagi kamu perjuangin pelan-pelan mulai nemuin jalannya. Semoga kamu semakin happy and i hope life gives you back every kindness you've been giving to everyone else.",
      "Thank you for turning boring ass days into my favorite memories. Thank you for making love feel calm, safe, and worth choosing every single day.",
      "Please live your life to the happiest, ya sayang. I'll always be the loudest person cheering for you, celebrating every little win, and standing beside you through every season.",
      "i love you more than words can ever explain.",
      "happy birthday once again, ndut. 🤍"
    ],
    signOff: "Always yours,"
  },
  previewCards: [
    {
      title: "Memories",
      description: "A little museum of us.",
      href: "/memories",
      icon: "✦",
      accent: "pink"
    },
    {
      title: "Love Studio",
      description: "Build a bouquet and write a letter.",
      href: "/love-studio",
      icon: "♡",
      accent: "blue"
    },
    {
      title: "Games",
      description: "Random little games about us.",
      href: "/games",
      icon: "◇",
      accent: "cream"
    },
    {
      title: "Garage",
      description: "Customize your Innova Silver 2022.",
      href: "/garage",
      icon: "↗",
      accent: "blue"
    },
  ] satisfies PreviewCard[],
  loveStats: [
    { label: "Days together", value: "∞", note: "and counting" },
    { label: "Photos together", value: "1K+", note: "mostly candid" },
    { label: "Laughs", value: "Too many", note: "never enough" },
    { label: "Still choosing you", value: "Always", note: "every single day" }
  ] satisfies LoveStat[],
  loveNotes: [
    { title: "I love how passionate you are", text: "Aku bakal betah-betah aja berjam-jam dengerin kamu ngomong soal mobil, business ideas, making money, random life plans, or whatever's currently living rent-free in your brain. Aku mungkin gapaham semuanya 100%... but i love watching you get excited dan itu udah cukup bgt bagi aku." },
    { title: "I love that you remember the tiniest things about me", text: "Kayak kamu inget aku suka nadin amizah, inget aku suka snack apa, inget cara bujuk aku biar gak ngambek lagi gimana, hal-hal random yang bahkan aku sendiri suka lupa pernah cerita. you always make me feel seen." },
    { title: "I love that you always try", text: "Even when things are hard, even when we're fighting, even when you're tired. Kalau kita mau jalan dan kamu gabisa janji, kamu tetep berusaha nyari cara biar aku gak kepikiran. Kamu selalu berusaha usahain and i notice every little effort you make dan makasih besar yah sayang selalu usahain aku." },
    { title: "I love that you're basically my walking health encyclopedia", text: "AKU TAU KM ANAK FK tapi entah kenapa kamu tau aja semua hal tentang kesehatan, badan, vitamin, random symptoms... aku selalu pulang bawa ilmu baru tiap habis ngobrol sama kamu tau, apalagi kalo aku lagi sakit km tiba-tiba udah tau aja obat apa yang harus aku minum. HEHEHEH KEREN TAUU SENGGG" },
    { title: "I love how gentle you are", text: "Kamu sabar banget sama aku (which honestly deserves an award), kamu gak teriak teriak sama aku, you don't say things just to hurt me, and you always try to control your emotions. thank you for loving me softly." },
    { title: "I love that you always complain when i hug you with only one hand", text: "'peluknya yang bener dong pake dua tangan.' WKKWEKWKEKWEKWKE sekarang malah jadi kebiasaan yang selalu aku inget tiap meluk kamu dan itu gemes tau seng" },
    { title: "I love that you're someone i can trust", text: "Kamu bisa nyimpen rahasia dan selalu terbuka sama aku. Menurut aku seru bgt kalo misalnya kamu lagi cerita karna selalu panjang dan aku ngeliatnya kayak bayi lagi ngomong terus gabisa berenti" },
    { title: "I love how seriously you take your future", text: "While everyone else is busy nongkrong every other day dan gak mikirin apa-apa kedepan, you're thinking about your grades, your career, and the kind of person you want to become. i'm genuinely proud of you." },
    { title: "I love how kind you are to people", text: "You're respectful, thoughtful, and you always think about everyone around you. Sometimes i wish you'd be that kind to yourself too... because you deserve the same kindness you give everyone else!!!" },
    {
      title: "And lastly... I love all of you.",
      text: `aku suka semua tentang kamu.

aku suka kelebihan kamu, kekurangan kamu, kebiasaan-kebiasaan kecil kamu, bahkan hal-hal yang kadang kamu insecure-in. aku rasa semua itu ya emang kamu. and i wouldn't change a thing.

jujur selama sama kamu aku ngerasa jadi orang yang jauh lebih baik. kamu bikin aku belajar banyak banget, belajar lebih sabar, lebih ngerti orang lain, lebih mikir sebelum ngomong, dan lebih sayang sama diri sendiri juga.

semoga aku juga bisa jadi orang yang bikin kamu berkembang. mungkin ga selalu, mungkin ga sempurna, tapi aku selalu pengen jadi alasan kecil kenapa kamu bisa jadi versi diri kamu yang lebih bahagia.

aku juga suka kita. karena walaupun kita sama-sama capek, sama-sama pernah bikin satu sama lain sedih, kita selalu milih buat balik lagi dan berjuang buat hubungan ini.

and i think that's my favorite thing about us.

i love every version of you.
the happy you, the sleepy you, the stressed you, the overthinking you, bahkan kamu yang ngambek dan off camera di call.

i just...
really, really love you.
happy birthday, bayi. ♡`
    }
  ] satisfies LoveNote[]
};
