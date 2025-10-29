/* ===========================
   Notes (sequential)
   =========================== */
const notes = [
  "I don’t need you to take my love or even return it.",
  "I just want you to know it exists — quietly, stubbornly, still beating for you.",
  "If it ever burdens you, you can forget it.",
  "If it ever warms you, then that’s enough for me.",
  "I’ll keep loving you, not to be chosen, but because loving you feels like the most honest thing I’ve ever done."
];

let currentIndex = 0;
const btn = document.getElementById('revealBtn');
const noteText = document.getElementById('noteText');
const tabMsg = document.getElementById('tab-message');
const tabHome = document.getElementById('tab-home');
const panelHome = document.getElementById('home');
const panelMsg = document.getElementById('message');

if (!btn || !noteText || !tabMsg) {
  console.error('Important DOM elements missing. Make sure revealBtn, noteText and tab-message exist.');
}

/* ------------------------------
   Tab navigation
   ------------------------------ */
function showPanel(which){
  if(which === 'home'){
    tabHome.classList.add('active'); tabMsg.classList.remove('active');
    panelHome.classList.add('active'); panelMsg.classList.remove('active');
    tabHome.setAttribute('aria-selected','true');
    tabMsg.setAttribute('aria-selected','false');
  } else {
    tabMsg.classList.add('active'); tabHome.classList.remove('active');
    panelMsg.classList.add('active'); panelHome.classList.remove('active');
    tabMsg.setAttribute('aria-selected','true');
    tabHome.setAttribute('aria-selected','false');
  }
}
tabHome.addEventListener('click', ()=> showPanel('home'));

/* Only run typewriter on first click of message tab */
let firstMessageOpen = false;
tabMsg.addEventListener('click', () => {
  showPanel('message');
  if(!firstMessageOpen){
    firstMessageOpen = true;
    runTypewriterIfNeeded();
  }
});

/* Reveal notes button */
btn.addEventListener('click', () => {
  if (currentIndex < notes.length) {
    noteText.textContent = notes[currentIndex];
    currentIndex++;
    if (currentIndex >= notes.length) {
      btn.disabled = true;
      btn.textContent = "No more notes";
      btn.classList.remove('primary');
      btn.style.opacity = 0.85;
      revealMessageTab();
    }
  }
});

function revealMessageTab(){
  tabMsg.style.display = "inline-block";
  tabMsg.style.opacity = 0;
  tabMsg.style.transform = "translateY(-6px)";
  requestAnimationFrame(()=> {
    tabMsg.style.transition = "opacity 0.55s ease, transform 0.55s ease";
    tabMsg.style.opacity = 1;
    tabMsg.style.transform = "translateY(0)";
    tabMsg.classList.add('reveal-pulse');
    setTimeout(()=> { tabMsg.classList.remove('reveal-pulse'); }, 1200);
  });
}

/* ------------------------------
   Typewriter (paragraph-by-paragraph)
   - Splits messageContent on double-newline (\n\n)
   - Types each paragraph into a <p> element inside #messageText
   - S2 speed ~45ms per char, with longer pause on paragraph end
   ------------------------------ */

const messageContent = `
    Marj, there's something I've been meaning to tell you. Back when we talked after graduation, we called it closure, but to me it never really felt like goodbye. It felt more like I was giving myself time to grow - to learn what it means to love someone deeply and genuinely.
    Somewhere along the years, I realized that no matter how far I went, you never really left my thoughts. You became this quiet standard my heart kept - something I didn't even notice at first. Every now and then, a random thing - a song, a place, a joke - pulls me back to our high school days, to those small, ordinary moments that ended up meaning everything to me.
    Lately, I've come to understand something I didn't before: maybe back then, I really did have a chance - a small, fragile one that I was too unsure to reach for. Thinking about that now feels heavy, like a gentle ache that makes me wish I'd just pushed a little more, been a little braver.
    You've become my Multo, haunting me - not in a way that hurts, but in a way that reminds me of what love once felt like when it was pure and real. And that memory has stayed, no matter how much I tried to move forward.
    I regret not pursuing you more, not standing by the loyalty I gave you, not giving my feelings the chance they deserved. I can't change the past, but I've grown since then, and I want to make things right, even if it's just through honesty.
    Honestly, seeing you on a random Saturday afternoon was like a shipwreck for me, as it made me remember every single emotion I've felt while falling in love with you during those years. And just the other day/week, we spoke up to each other just even for a tiny bit, And it dawned on me - I remember this warmth. I've been longing this kind of comfort for so long. And you still have it. I still have it for you.
    I'm scared, Marj - scared of stepping out of this shell, scared of being rejected again. But even with that fear, I want to give this my all. This is my final push, my final stand - to tell you that I still love you, and that I want to try again, slowly and sincerely. Me being scared has led me to developing this little project that I worked on for your birthday. It's not grant, and it's not much - but I worked hard and studied hard for me to precisely curate the necessary details.
    If you don't feel the same, I'll understand. You don't owe me anything. I feel pathetic for being this way, and I'm sorry. Just know that I'll still be one of your closest firends that you can lean on. I just needed you to know this, because pretending otherwise would be lying to myself.
  `;

// paragraph split (double newlines create paragraphs)
const paragraphs = messageContent.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
const TYPE_SPEED = 45;
const messageContainer = document.getElementById('messageText');
let typingInProgress = false;

function typeParagraphs(pars, idx = 0){
  if (!messageContainer) return;
  if(idx >= pars.length){
    // finished typing all paragraphs
    localStorage.setItem('messageShown','1');
    // reveal heart signature
    showHeartSignature();
    return;
  }

  const p = document.createElement('p');
  messageContainer.appendChild(p);
  const text = pars[idx];
  let i = 0;

  function typeChar(){
    if(i < text.length){
      p.textContent += text[i++];
      // small pause at commas/periods can be simulated
      let delay = TYPE_SPEED;
      if(text[i-1] === ',' || text[i-1] === ';') delay = TYPE_SPEED * 1.3;
      if(text[i-1] === '.' || text[i-1] === '!' || text[i-1] === '?') delay = TYPE_SPEED * 1.9;
      setTimeout(typeChar, delay);
    } else {
      // paragraph finished — small pause then type next paragraph
      setTimeout(()=> typeParagraphs(pars, idx + 1), 700);
    }
  }
  typeChar();
}

function runTypewriterIfNeeded(){
  if(!messageContainer) return;
  const shown = localStorage.getItem('messageShown');
  // if not shown, run the paragraph typing
  if(!shown){
    messageContainer.innerHTML = ""; // clear
    typeParagraphs(paragraphs, 0);
  } else {
    // already shown — render static paragraphs
    messageContainer.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    // also ensure heart is visible if it had been shown previously
    const heart = document.getElementById('heartSignature');
    if(heart) heart.classList.add('show');
  }
}

/* helper to keep text safe when inserting as HTML for stored view */
function escapeHtml(unsafe){
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ------------------------------
   Heart signature reveal + animation (right-aligned)
   ------------------------------ */
function showHeartSignature(){
  const heart = document.getElementById('heartSignature');
  if(!heart) return;
  // reveal with fade-in
  heart.classList.add('show');
}

/* ------------------------------
   Floating hearts (moderate)
   ------------------------------ */
const heartsContainer = document.getElementById('hearts');
let heartCount = 0;
const maxHearts = 12;
function spawnHeart(){
  if(heartCount >= maxHearts) return;
  heartCount++;
  const heart = document.createElement('div');
  heart.className = 'heart-float';
  heart.textContent = '❤';
  heart.style.left = (6 + Math.random()*88) + '%';
  heart.style.fontSize = (14 + Math.random()*22) + 'px';
  heart.style.animationDuration = (5 + Math.random()*5) + 's';
  heartsContainer.appendChild(heart);
  setTimeout(()=> { heart.remove(); heartCount--; }, 9000);
}
const heartInterval = setInterval(()=> spawnHeart(), 700);

/* ------------------------------
   On-load defaults
   ------------------------------ */
document.addEventListener('DOMContentLoaded', ()=> {
  showPanel('home');
  for(let i=0;i<4;i++) setTimeout(spawnHeart, i*220);
});
