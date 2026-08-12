"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Interest = { id: string; label: string; note: string; icon: string; image?: string; link?: string };
type Person = "andra" | "angie";

const letterIcons = ["mail", "rain", "mirror", "moon", "bandage", "bolt", "sun", "heart", "spark", "trophy", "hug", "battery"];
const letterColors = ["#efacc0", "#a9caea", "#edcb72", "#aaaed8", "#e7a48f", "#9bcbb4", "#f2b9cb", "#9fbfdf", "#d8b4df", "#a6c9c3", "#edb394", "#b9afd5"];
const guideIcons = ["flame", "rain", "sun", "eye", "battery", "swirl"];
const interestIconOptions = ["star", "headphones", "game", "film", "food", "travel", "book", "art", "sport", "idea"];

const letters = [
  ["when you miss me", "💌", "#f2a9bd", "kalau kamu buka ini, berarti BAYIII LAGI KANGEN YAAA? aku juga sering kok tiba-tiba kepikiran kamu pas lagi makan, lagi di jalan, lagi denger lagu, atau pas liat sesuatu yang bikin aku kayak, 'ih ini bayi banget.' \n\nsebenernya aku juga ngga jago ngilangin kangen ke kamu yah, paling yaa cuma nunggu sambil ngumpulin cerita buat diceritain pas kita ketemu lagi. jadi kalau lagi kangen banget, chat AKU BAYI terus minta aku VIDEO CALL KAMU JANGAN SOK SOK GAMAU. aku ga akan pernah kesel cuma karena kamu nyari aku dan aku akan selalu nyari waktu buat bayiku. SABAR YAAA KITA PASTI BERTEMUUUUU"],
  ["when you had a bad day", "🌧️", "#a9c8e9", "haii sayangkuu, sabar yahh sayangg kalau harinya lagi kurang enakk. gapapa kok kalau semuanya ga berjalan sesuai yang kamu mau, semua orang juga punya hari yang rasanya berantakan..\n\nbad day kamu nggak bikin aku sayang kamu lebih sedikit, coba kamu makann atau nontonn lakuin hal yang kamu seneng. aku tau kamu udah berusaha sebaik mungkin buat jadi anak yang baikk jadi tidapapa sayangg itsokayyy semuanya bisa diperbaikin dan kamu pasti bisa lebih baik lagii besok besokk yaa sayangkuu.\n\n kalau hari ini memang lagi apes, semoga besok bisa lebih baik lagi harinya yaa sayangkuuuu i love youu"],
  ["when you doubt yourself", "🪞", "#f2ce78", "BAYII GABOLEH RAGUIN DIRI KAMU SENDIRI YAA SAYAANGG. BAYI TUH PINTER TERUS HEBATTT, BAYI PASTI BISAA KOKKK AKU YAKINNNN. aku yakin kokk kamu bisa wujudin apapun yang kamu mau, jangan ragu sama potensi2 kamu sayaanggg.\n\naku PROUDD BESAARRR sama kamuuuuu, bahkan sebelum semuanya berhasil juga aku udah bangga banget sayaangg.\n\naku tau mungkin kadang kamu merasa kuranggg, maafin aku kalau belum bisa ngebantu kamu secara langsung. aku cuma pengen kamu inget kalau aku gapernah ragu sama kamu. apapun yang kamu mau lakuin, mau capai, mau ubah aku akan selalu dukung selama semuanya positif yaa sayangkuuuu."],
  ["when you can't sleep", "🌙", "#a9addb", "ihhh berarti ini ade tidur duluan daripada kamuu? GAMAU TAU kamu udahan main hpnya, taro rada jauh biar gak dimainin mulu, MEREEMM AJAA SAMPE TETIDUR. kamu gabolehh sering2 begadanggg kalau tidak ada belajar yang dikejar senggg, sayangin badan kamuuu ndut km itu pen tidur.\n\nkalau masih belum bisa tidur, BANGUNINNN AKUU TELFON AKUU NANTI KITA BOBO BARENG YAAAAA SAYANGKUUU"],
  ["when we just had a fight", "🩹", "#e9ad96", "mungkin kita berdua masih sama-sama kesel sama satu sm lain, tp aku sendiri gakbisa seng kalo kamu harus maksa buat ninggalin aku cuma karna butuh waktu sendiri. kita bisa setelah kepala lebih dingin, aku mau dengar dan mencari jalan tengah bareng.\n\nplease be gentle with me, i will try too. maafin aku kalau cara aku bicara kurang enak kamu denger, maaf kalau aku salah sama kamu disini. kita omongin bareng2 aja yah sayanngg jangan ditunda, jangan berlarut-larut, kamu pasti minta aku nurunin ego aku, aku minta kamu buat jangan fokus sama ngejelasin kenapa kamu ngelakuin ini dan itu. kadang aku gabutuh dijelasin berkali2 kenapa kamu ngelakuin kesalahan itu, aku pengen denger cara kamu nanggulanginnya gimana, cara kamu bikin aku gak kesel dan khawatir dengan hal yang sama kayak gimana, sama permintaan maaf dari kamu. \n\njangan bilang 'maaf yaa bikin kamu bete', kurang enak didenger kaann sayaangg? enakan kalau minta maafnya lebih fokus ke janji buat kedepannya kayak gimana dan kamu bakal gimana perlakuannya. ini bukan cuma buat kamu kok, ini juga berlaku buat aku biar kita sama-sama jadi orang yang lebih baik buat satu sama lain yah sayaanggg. i loveee youuu"],
  ["when you need motivation", "⚡", "#a8d1bd", "aku tau akhir-akhir ini pasti capek banget yaa sayanggg.kadang aku liat kamu suka terlalu keras sama diri sendiri. kalau hasilnya belum sesuai, kamu langsung ngerasa kurang, ngerasa belum cukup. padahal aku yang ngeliat dari luar aja tau banget seberapa banyak usaha yang udah kamu keluarin.\n\nbayi, gapapa kalau hari ini progressnya dikit. gapapa kalau hari ini kamu cuma bisa nyelesain satu hal. kamu gak harus ngebuktiin apa-apa ke siapa pun. yang penting jangan berhenti yaa.aku selalu bangga sama kamu. bukan pas kamu dapet nilai bagus aja, bukan pas semuanya berhasil aja. aku bangga sama kamu karena aku tau kamu selalu nyoba. dan menurut aku, itu yang paling penting.\n\nnanti kalau suatu hari kamu berhasil ngedapetin semua yang kamu mau, aku harap kamu juga inget buat nengok ke belakang bentar. liat sejauh apa kamu udah jalan. soalnya aku yakin... versi kamu yang dulu pasti bangga banget sama kamu yang sekarang. semangat yaa bayi. i'm always rooting for you."],
  ["when you're happy", "🎉", "#f5c3d0", "YAY SO HAPPY KALAU KAMUU HAAPPYY SAYAANGG! apa pun yang bikin kamu seneng sekarang aku juga mauu dengeerrrr. bayi harus ceritain ke ade dari awal, kirim foto, voice note, atau telepon akuUUUU YAH.\n\njangan ada yang diskip. aku pengen tau semuanya, bahkan hal-hal kecil yang menurut kamu 'ah biasa aja'. buat aku, kalau itu bikin kamu seneng, berarti itu juga penting. semoga hari-hari kayak gini makin banyak ya sayangg. semoga kamu selalu dikasih banyak alasan buat senyum, banyak kabar baik, banyak hal yang bikin kamu bangga sama diri sendiri.\n\naku juga mau jadi salah satu alasan kamu bahagia. i love seeing you happy, bayi."],
  ["when you wonder if i still love you", "🤍", "#b5d2ef", "kalau kamu buka surat ini, kemungkinan besar kamu lagi kepikiran 'ade masih sayang aku ga ya?'\n\njawabannya... MASIH. bahkan kalau suatu hari nanti aku lagi kesel sama kamu, lagi capek, lagi diem, atau kita lagi ga baik-baik aja, rasa sayang itu ga langsung ilang gitu aja. sayang itu bukan cuma pas semuanya gampang.\n\naku tau kadang aku ga selalu nunjukinnya dengan cara yang paling bagus. mungkin aku lagi sibuk, lagi badmood, atau responku ga sebagus biasanya. tapi itu bukan berarti aku berhenti milih kamu bayi.\n\naku masih milih kamu. masih pengen denger cerita kamu. masih pengen jadi orang pertama yang kamu cari kalau lagi seneng atau sedih. masih pengen nemenin kamu selama kamu masih mau aku temenin.\n\njadi kalau suatu hari kepala kamu mulai ngarang cerita sendiri, tolong inget surat ini yaa sayang. jangan biarin rasa takut ngomong lebih kenceng daripada semua bukti yang udah kita lewatin bareng.\n\ni still love you. i always will, for as long as you'll let me."],
  ["when i'm being annoying", "🙇🏻‍♀️", "#e9ad96", "kalau kamu buka ini, berarti ada kemungkinan aku lagi nyebelin ya... HEHE maaf ya sayanggg.\n\nkadang aku emang suka kebawa emosi, kebanyakan mikir, atau minta diyakinin terus. bukan karena aku mau bikin kamu capek, tapi karena aku masih belajar buat ngatur semuanya.\n\nmakasih ya udah sabar sama aku. makasih karena kamu masih milih buat ngadepin aku walaupun kadang aku ribet banget. aku janji bakal terus belajar jadi pasangan yang lebih baik buat kamu.\n\nkalau aku lagi nyebelin, jangan langsung nyerah sama aku yaa. tegur aku pelan-pelan, peluk aku kalau bisa, terus kita benerin bareng. aku gamau kita jadi musuhan cuma karena sama-sama gengsi.\n\ni love you, even on the days i'm the difficult one."],
  ["when you're proud of yourself", "🥹", "#a8d1bd", "YAAAYYYY BAYIII AKHIRNYA KAMU BANGGA SAMA DIRI SENDIRIII!!! AKU IKUT SENENG BANGETTTT.\n\njujur ya, aku berharap kamu bisa lebih sering ngeliat diri kamu dari sudut pandang aku. soalnya aku tuh sering banget bangga sama kamu bahkan pas kamu sendiri ngerasa hasilnya biasa aja.\n\nhari ini, jangan buru-buru mikir 'ah masih kurang'. nikmatin dulu yaa perasaan bangga itu. kamu berhak ngerayain semua usaha yang udah kamu keluarin, sekecil apa pun hasilnya.\n\naku harap ini jadi awal dari banyak momen dimana kamu sadar kalau ternyata kamu emang sehebat itu. i'm so, so proud of you, bayi NDUUUTTT"],
  ["when you need to feel loved", "🫂", "#f5c3d0", "hei sayangkuuu...\n\nkalau hari ini kamu lagi ngerasa sendirian, ga cukup disayang, atau cuma pengen diyakinin... sini ADE YAKININNN.\n\naku sayang banget sama kamu. lebih dari yang mungkin sering aku ucapin. aku suka cara kamu ketawa, cara kamu cerita panjang lebar tentang hal yang kamu suka, cara kamu selalu berusaha walaupun capek, bahkan hal-hal kecil yang mungkin kamu sendiri ga sadar.\n\nbuat aku, kamu tuh bener bener orang yang selalu aku cari di keadaan apapunnnn. orang yang selalu pengen aku datenginn. dan aku harap aku juga bisa jadi orang yang sama seperti itu buat kamu.\n\njadi kalau lagi butuh diingetin, baca ini pelan-pelan ya. bayangin AJA ADE LAGI MELUK BAYI SAMBIL ISEP KETEK KAMU HEHEHEHHEHEH\n\nkamu tuhh disayang banget. kamu ga perlu ngapa-ngapain dulu buat pantas dapet rasa sayang itu. cukup jadi kamu aja yaaa sengg"],
  ["when you feel really tired about everything", "🫂", "#c8bfdc", "sayanggg... ngobrol dulu sama ade dong huhu.\n\naku tau akhir-akhir ini rasanya kayak semuanya numpuk. capeknya bukan cuma badan, tapi kepala juga. mungkin kamu udah berusaha sekuat tenaga tapi rasanya kok ga ada habisnya.\n\nkalau emang hari ini udah terlalu berat, gapapa kok istirahat duluuuu.\n\naku cuma pengen kamu inget satu hal. kamu ga sendirian. walaupun aku gabisa selalu ada di samping kamu secara langsung, aku bakal selalu dukung kamu dari mana pun.\n\nnanti kalau semuanya udah lewat, kita seneng seneng bareng yahh bayiii beli semua barang yang bayi mauuu. tapi buat sekarang... istirahat dulu ya sayang. makan yang bener, minum air, terus peluk aku kalau udah ketemu nanti.\n\ni'm always on your side. always."]
] as const;

const guides = [
  ["Angie mad", "🌶️", "#ef9a98", [
    "JANGAN NGILANG. bilang aja kalo kamu disini, dan kita selesaiin pelan-pelan yah",
    "Dengerin dulu sampai aku selesai ngomong, jangan langsung jelasin kenapa kamu ngelakuin itu",
    "Kalau mau minta maaf, fokus ke gimana kamu bakal memperbaikinya, bukan cuma 'maaf bikin kamu bete'",
    "Kalau udah mulai adem... peluk adeee. biasanya langsung luluh HEHE"
  ]],

  ["Angie sad", "🌧️", "#9ebcdf", [
    "Temenin aku walaupun cuma diem di call atau duduk bareng",
    "Tanya dulu, 'kamu mau didengerin atau mau dicariin solusi?'",
    "Jangan maksa aku langsung semangat yah biarin ade ngerasain sedihnya bentar.",
    "Peluk aku sambil di elus elus trs janjian ketemu lagi next mau ngapain"
  ]],

  ["Angie happy", "🎉", "#f1c664", [
    "WAJIB ikutan excited hehe pura-pura lebay juga gapapa.",
    "Minta aku cerita dari awal sampai akhir yah jangan ada detail yang diskip.",
    "SEPETI YG KAMU BLG BIASANYA KL KAMU PROUD BESAR SAMA AKU",
    "Kalau bisa rayain barenggg hehe makan enak juga udah cukup ade mau dubai chewy"
  ]],

  ["Angie jealous", "👀", "#c3a5d9", [
    "Jangan becandain kalo ade cemburu nanti malah makin kepikiran",
    "Reassure aku dengan jelas tanpa bikin aku ngerasa lebay.",
    "Kalau ada yang bisa disalahpahami, jelasin pelan-pelan dari awal",
    "PELUK AKU IH"
  ]],

  ["Angie tired", "🫧", "#a9d3c5", [
    "SLEEPCAALLLLLL",
    "Ingetin aku makan, minum, sama istirahat soalnya ade suka lupa.",
    "Kalau bisa bantu satu hal kecil, itu udah bikin aku tenang banget",
    "Kirim goodnight yang gemesh atau temenin aku sampe ketiduran"
  ]],

  ["Angie overthinking", "🌀", "#e4b2c2", [
    "Tolong jangan bilang 'kamu overthinking'. aku juga tau kok YAH.",
    "Yakinin aku pakai tindakan atau contoh yang nyata, bukan cuma 'percaya aja'.",
    "Sabar yaa kalau aku nanya hal yang sama lagi. aku lagi nenangin kepala sendiri HUHU",
    "Peluk aku SENGGGGG"
  ]]
] as const;

const starters: Record<Person, Interest[]> = {
  andra: [
    { id: "a1", label: "Cars & Ferrari", note: "fast and beautifully engineered", icon: "🏎️" },
    { id: "a2", label: "LEGO", note: "for a slow weekend together", icon: "🧱" },
    { id: "a3", label: "Good sneakers", note: "pairs worth hunting for", icon: "👟" }
  ],
  angie: [
    { id: "g1", label: "Flowers", note: "especially ones with a story", icon: "🌷" },
    { id: "g2", label: "Cute cafés", note: "pretty corners + good food", icon: "🍰" },
    { id: "g3", label: "Little love notes", note: "proof you thought of me", icon: "💌" }
  ]
};

const KEY = "luthfiandra-box-of-interest";

export function ForYouPage() {
  const [letter, setLetter] = useState<(typeof letters)[number] | null>(null);
  const [items, setItems] = useState(starters);
  const [adding, setAdding] = useState<Person | null>(null);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState("star");
  const [image, setImage] = useState("");
  const [interestLink, setInterestLink] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem(KEY); if (saved) setItems(JSON.parse(saved)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!adding || !label.trim()) return;
    setItems((old) => ({ ...old, [adding]: [...old[adding], { id: String(Date.now()), label: label.trim(), note: note.trim() || "something worth remembering", icon, image: image.trim() || undefined, link: normalizeLink(interestLink) }] }));
    setLabel(""); setNote(""); setIcon("star"); setImage(""); setInterestLink(""); setAdding(null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ef] text-[#351923]">
      <section className="relative border-b-2 border-[#50182a] px-5 py-20 text-center">
        <span className="absolute right-[8%] top-16 hidden h-20 w-20 rotate-12 text-[#c43c64] md:block"><IconArt name="heart" /></span>
        <p className="font-mono text-[10px] font-black uppercase tracking-[.35em] text-[#bd3e63]">some of me for you ndut</p>
        <h1 className="mx-auto mt-5 max-w-5xl font-serif text-6xl font-black leading-[.9] sm:text-8xl">for every version <span className="italic text-[#c83f65]">of you.</span></h1>
        <p className="mx-auto mt-7 max-w-xl font-mono text-xs leading-6 text-[#694955]">maaf ya, bayi. aku tau aku gak akan selalu bisa ada di samping kamu setiap saat. mungkin nanti ada hari di mana aku lagi sibuk, kita lagi berantem, atau aku gak bisa langsung nemenin kamu. semoga setiap kali kamu buka surat-surat ini, rasanya sedikit lebih dekat sama aku.</p>
        <a href="#letters" className="mt-9 inline-block bg-[#790826] px-6 py-3 font-mono text-[10px] font-black uppercase text-white shadow-[4px_5px_0_#a9c7e8]">open a letter ↓</a>
      </section>

      <section id="letters" className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="special for NDUT" title="open this when you..." note="Choose the envelope that matches the moment." />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {letters.map((item, i) => (
              <button key={item[0]} onClick={() => setLetter(item)} className={`group relative min-h-64 overflow-hidden border-2 border-[#50182a] p-5 text-left shadow-[7px_8px_0_#31547e] transition hover:-translate-y-2 hover:rotate-0 ${i % 2 ? "rotate-[1deg]" : "-rotate-[1deg]"}`} style={{ backgroundColor: letterColors[i] ?? item[2] }}>
                <span className="absolute right-4 top-4 border-2 border-[#50182a] px-2 py-1 font-mono text-[8px] font-black">{String(i + 1).padStart(2, "0")}</span>
                <span className="absolute inset-x-0 top-0 h-[46%] origin-top bg-white/15 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
                <div className="relative flex h-full flex-col justify-end"><span className="mb-auto block h-14 w-14 text-[#561b30]"><IconArt name={letterIcons[i] ?? "mail"} /></span><p className="font-serif text-2xl font-black">open this {item[0]}</p><span className="mt-5 w-fit border-b-2 border-current font-mono text-[9px] font-black uppercase">break the seal →</span></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#50182a] bg-[#b9d1ed] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="andra's field manual · important" title="do this when Angie is..." note="A cheat sheet for loving me in the language I need that day." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, guideIndex) => <article key={guide[0]} className="overflow-hidden border-2 border-[#451727] bg-[#fffaf2] shadow-[6px_7px_0_#d9849e] transition hover:-translate-y-1"><header className="flex items-center justify-between border-b-2 border-[#451727] p-5" style={{ backgroundColor: guide[2] }}><h3 className="font-serif text-2xl font-black">{guide[0]}</h3><span className="h-12 w-12 text-[#501426]"><IconArt name={guideIcons[guideIndex]} /></span></header><ol className="space-y-4 p-5">{guide[3].map((step, i) => <li key={step} className="flex gap-3 font-mono text-[11px] leading-5"><b className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#790826] text-[9px] text-white">{i + 1}</b>{step}</li>)}</ol></article>)}
          </div>
          <p className="mt-8 text-center font-serif text-lg italic">When in doubt: communicate, reassure, bring snacks. ♡</p>
        </div>
      </section>

      <section id="interests" className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="insert curiosity here" title="our box of interest" note="A vending machine of things we love, want to try, or want the other person to remember. Keep feeding it." />
          <div className="mt-12 border-[3px] border-[#331622] bg-[#78102f] p-3 shadow-[12px_14px_0_#31547e] sm:p-6">
            <header className="mb-4 border-2 border-white/30 bg-[#410b20] px-5 py-4 text-white"><p className="font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#f0a9bc]">Luthfiandra curiosity dispenser</p><p className="font-serif text-2xl font-black italic">pick something to understand me better</p></header>
            <div className="grid gap-4 lg:grid-cols-2">
              {(["andra", "angie"] as Person[]).map((person) => <Shelf key={person} person={person} items={items[person]} onAdd={() => setAdding(person)} onRemove={(id) => setItems((old) => ({ ...old, [person]: old[person].filter((x) => x.id !== id) }))} />)}
            </div>
            <p className="mt-4 border-2 border-white/30 bg-[#520a25] py-4 text-center font-mono text-[9px] font-black uppercase tracking-widest text-white">▰ new interests accepted forever ↻</p>
          </div>
        </div>
      </section>

      {letter && <div className="letter-backdrop fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#2b0c18]/75 px-4 py-8 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setLetter(null)}><article className="letter-open relative w-full max-w-2xl border-2 border-[#491626] bg-[#fffaf0] p-7 shadow-[12px_14px_0_#a9c7e8] sm:p-12"><button onClick={() => setLetter(null)} className="absolute right-4 top-3 text-3xl">×</button><p className="font-mono text-[9px] font-black uppercase tracking-[.28em] text-[#bd3e63]">special delivery for Andra</p><h2 className="mt-4 font-serif text-4xl font-black">open this {letter[0]}</h2><p className="mt-8 whitespace-pre-wrap border-y border-[#b8959f] py-7 font-serif text-[17px] leading-8">{letter[3]}</p><p className="mt-8 font-serif text-2xl italic">love, Angie ♡</p></article></div>}

      {adding && <div className="letter-backdrop fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#2b0c18]/75 px-4 py-8" onMouseDown={(e) => e.target === e.currentTarget && setAdding(null)}><form onSubmit={submit} className="letter-open w-full max-w-lg border-2 border-[#491626] bg-[#fffaf0] p-6 shadow-[9px_10px_0_#a9c7e8]"><p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#bd3e63]">restock {adding}&apos;s side</p><h2 className="mt-2 font-serif text-3xl font-black">add a new interest</h2><p className="mt-2 font-mono text-[9px] leading-4 text-[#80616d]">Choose a proper icon, or paste a photo URL to make the card your own.</p><div className="mt-6 grid grid-cols-5 gap-2">{interestIconOptions.map((choice) => <button key={choice} type="button" onClick={() => setIcon(choice)} className={`grid aspect-square place-items-center border p-2 transition ${icon === choice ? "border-[#790826] bg-[#f2c8d4] shadow-[2px_3px_0_#31547e]" : "border-[#bba3aa] bg-white hover:-translate-y-1"}`} aria-label={`Use ${choice} icon`}><span className="h-7 w-7 text-[#52172b]"><IconArt name={choice} /></span></button>)}</div><input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Optional photo URL (https://...)" type="url" className="mt-3 w-full border-2 border-[#31547e] p-3 font-mono text-xs"/><input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Interest name, e.g. Formula 1" className="mt-3 w-full border-2 border-[#31547e] p-3 font-mono text-xs"/><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why it belongs here..." rows={3} className="mt-3 w-full border-2 border-[#31547e] p-3 font-mono text-xs"/><input value={interestLink} onChange={(e) => setInterestLink(e.target.value)} placeholder="Optional link (website, playlist, wishlist...)" type="url" className="mt-3 w-full border-2 border-[#31547e] p-3 font-mono text-xs"/><div className="mt-4 flex gap-3"><button className="flex-1 bg-[#790826] p-3 font-mono text-[10px] font-black text-white">put it in</button><button type="button" onClick={() => setAdding(null)} className="border-2 border-[#790826] px-4 font-mono text-[10px]">cancel</button></div></form></div>}
    </main>
  );
}

function Heading({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return <header className="text-center"><p className="font-mono text-[9px] font-black uppercase tracking-[.3em] text-[#b6375d]">{eyebrow}</p><h2 className="mt-3 font-serif text-5xl font-black sm:text-6xl">{title}</h2><p className="mx-auto mt-4 max-w-lg font-mono text-[11px] leading-5 text-[#6d4c57]">{note}</p></header>;
}

function Shelf({ person, items, onAdd, onRemove }: { person: Person; items: Interest[]; onAdd: () => void; onRemove: (id: string) => void }) {
  const code = person === "andra" ? "A" : "G";
  return <section className="border-2 border-[#32131e] bg-[#ece4d8] p-3"><header className={`mb-3 flex items-center justify-between border-2 border-[#32131e] px-4 py-3 ${person === "andra" ? "bg-[#abc9e9]" : "bg-[#efb2c2]"}`}><div><p className="font-mono text-[8px] font-black uppercase">shelf {code}</p><h3 className="font-serif text-3xl font-black capitalize">{person}</h3></div><button onClick={onAdd} className="bg-[#32131e] px-4 py-2 font-mono text-[9px] font-black uppercase text-white">+ restock</button></header><div className="grid min-h-72 grid-cols-2 gap-3 sm:grid-cols-3">{items.map((item, i) => { const fallback = legacyInterestIcon(item.label); return <article key={item.id} className="group relative flex min-h-48 flex-col overflow-hidden border-2 border-[#32131e] bg-[#fffaf2] p-3 shadow-[3px_4px_0_#8b6d75] transition hover:-translate-y-1">{item.image ? <div className="mb-3 aspect-[4/3] w-full border border-[#83616d] bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e5edf7] p-2 text-[#421725]"><IconArt name={interestIconOptions.includes(item.icon) ? item.icon : fallback} /></span>}<p className="mt-3 font-serif text-lg font-black leading-tight">{item.label}</p><p className="mt-2 font-mono text-[8px] leading-4 text-[#72535e]">{item.note}</p><div className="mt-auto flex items-end justify-between gap-2 pt-3"><span className="font-mono text-[8px] font-black text-[#b6375d]">{code}{String(i + 1).padStart(2, "0")}</span>{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="border-b border-[#31547e] font-mono text-[8px] font-black uppercase text-[#31547e]">visit ↗</a>}</div><button onClick={() => onRemove(item.id)} className="absolute right-2 top-2 hidden h-7 w-7 rounded-full bg-[#790826] text-white shadow group-hover:block" aria-label={`Remove ${item.label}`}>×</button></article>})}<button onClick={onAdd} className="min-h-48 border-2 border-dashed border-[#76535e] p-4 font-mono text-[9px] font-black uppercase transition hover:bg-white"><span className="mx-auto mb-3 block h-9 w-9"><IconArt name="plus" /></span>empty slot<br/><span className="font-normal lowercase">add something new</span></button></div></section>;
}

function normalizeLink(value: string) {
  const clean = value.trim();
  if (!clean) return undefined;
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
}

function legacyInterestIcon(label: string) {
  const value = label.toLowerCase();
  if (value.includes("car") || value.includes("ferrari")) return "car";
  if (value.includes("lego")) return "blocks";
  if (value.includes("sneaker") || value.includes("shoe")) return "shoe";
  if (value.includes("flower")) return "flower";
  if (value.includes("café") || value.includes("cafe")) return "food";
  if (value.includes("note") || value.includes("letter")) return "mail";
  return "star";
}

function IconArt({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<string, React.ReactNode> = {
    mail: <><rect x="4" y="6" width="16" height="12" rx="1.5"/><path d="m5 8 7 5 7-5"/></>,
    rain: <><path d="M7 16H6a4 4 0 0 1 0-8 6 6 0 0 1 11 2h1a3 3 0 0 1 0 6"/><path d="m8 19-1 2m5-2-1 2m5-2-1 2"/></>,
    mirror: <><ellipse cx="12" cy="10" rx="6" ry="8"/><path d="M12 18v4m-3 0h6"/><path d="m9 8 2-2"/></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
    bandage: <><path d="m7 17 10-10a3.5 3.5 0 0 0-5-5L2 12a3.5 3.5 0 0 0 5 5Z"/><path d="m8 8 8 8m-5-5 2 2"/></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3-7-1.5 1.5M6.5 17.5 5 19m14 0-1.5-1.5M6.5 6.5 5 5"/></>,
    heart: <path d="M20.8 5.8c-2.1-2.2-5.6-2.2-7.7 0L12 7l-1.1-1.2a5.3 5.3 0 0 0-7.7 0 5.7 5.7 0 0 0 0 7.9L12 22l8.8-8.3a5.7 5.7 0 0 0 0-7.9Z"/>,
    spark: <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"/>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm4 9v5m-4 3h8m-6-3h4"/><path d="M8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4"/></>,
    hug: <><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><path d="M3 21v-5a5 5 0 0 1 9 0 5 5 0 0 1 9 0v5M7 15l5 4 5-4"/></>,
    battery: <><rect x="3" y="7" width="17" height="10" rx="2"/><path d="M20 10h2v4h-2M7 10v4m3-4v4m3-4v4"/></>,
    flame: <path d="M12 22c5 0 8-3.5 8-8.2 0-3.4-2-6.4-5.5-9.8.2 4-1.4 5.5-2.5 6.2C11.5 7 9.8 5 8 4c.2 3.8-4 5.2-4 10 0 4.5 3.2 8 8 8Z"/>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    swirl: <path d="M20 12a8 8 0 1 1-3-6.2c3 2.4 2.4 7.2-.8 8.7-2.8 1.4-6.2-.2-6.2-3 0-2.2 2.7-3.4 4.2-1.9"/>,
    star: <path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 6.9-6.2-3.5L5.8 21l1.4-6.9L2 9.3l7-.8L12 2Z"/>,
    headphones: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/></>,
    game: <><path d="M7 9h10a5 5 0 0 1 4.5 7.2l-1 2a2.5 2.5 0 0 1-4 .6L14 17h-4l-2.5 1.8a2.5 2.5 0 0 1-4-.6l-1-2A5 5 0 0 1 7 9Z"/><path d="M7 13v4m-2-2h4m7-1h.01m3 2h.01"/></>,
    film: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14m10-14v14M3 9h4m10 0h4M3 15h4m10 0h4"/></>,
    food: <><path d="M4 12h16a8 8 0 0 1-16 0Z"/><path d="M8 9c-1-2 2-2 1-4m4 4c-1-2 2-2 1-4m4 4c-1-2 2-2 1-4M3 20h18"/></>,
    travel: <><path d="M3 11h18l-6-3-2-5h-2v5l-5 2-2-3H3v4Zm8 0v9"/></>,
    book: <><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z"/><path d="M20 4h-4a3 3 0 0 0-2 1v15a3 3 0 0 1 3-3h3V4Z"/></>,
    art: <><path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4c0-3.3-4-6-9-6Z"/><circle cx="7" cy="10" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="15" cy="7" r="1" fill="currentColor"/></>,
    sport: <><circle cx="12" cy="12" r="9"/><path d="m8 5 4 3 4-3m-4 3v5m-5 5 2-5h6l2 5M3 11l6 2m12-2-6 2"/></>,
    idea: <><path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12c1 1 1 2 1 4h6c0-2 0-3 1-4a7 7 0 0 0-4-12Z"/></>,
    car: <><path d="m5 16-1-4 3-5h10l3 5-1 4H5Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M7 12h10"/></>,
    blocks: <><rect x="3" y="12" width="8" height="8"/><rect x="13" y="12" width="8" height="8"/><rect x="8" y="4" width="8" height="8"/></>,
    shoe: <path d="M3 15c4 1 6-2 7-8l4 5 6 2c2 1 2 5-1 5H5c-2 0-3-2-2-4Z"/>,
    flower: <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="6" r="3"/><circle cx="18" cy="12" r="3"/><circle cx="12" cy="18" r="3"/><circle cx="6" cy="12" r="3"/></>,
    plus: <path d="M12 4v16M4 12h16"/>
  };
  return <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true" {...common}>{shapes[name] ?? shapes.star}</svg>;
}
