/* ===========================
   Notes (sequential)
   =========================== */
const notes = [
  "Happy Birthday, Marj!",
  "I hope for the best for your future endeavors.",
  "Keep pushing to realize your dreams!",
  "I'll always be here cheering for you!",
  "But, can I borrow some of your time?",
  "This won't take long.",
  "Press the Message tab."
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
   Tab navigation (Home / Message)
   - Message tab is hidden initially via CSS (#tab-message { display:none; })
   - Only reveal it after notes exhausted.
   ------------------------------ */
function showPanel(which){
  if(which === 'home'){
    tabHome.classList.add('active'); tabMsg.classList.remove('active');
    panelHome.classList.add('active'); panelMsg.classList.remove('active');
    // ensure aria states
    tabHome.setAttribute('aria-selected','true');
    tabMsg.setAttribute('aria-selected','false');
  } else {
    tabMsg.classList.add('active'); tabHome.classList.remove('active');
    panelMsg.classList.add('active'); panelHome.classList.remove('active');
    tabMsg.setAttribute('aria-selected','true');
    tabHome.setAttribute('aria-selected','false');
    // don't auto-run typewriter here — handled on first click
  }
}

tabHome.addEventListener('click', ()=> showPanel('home'));

/* Attach tabMsg click below (only want to run the typewriter on FIRST real click.) */
let firstMessageOpen = false;
tabMsg.addEventListener('click', () => {
  showPanel('message');
  if(!firstMessageOpen){
    firstMessageOpen = true;
    runTypewriterIfNeeded(); // runs typewriter on first click only
  }
});

/* ------------------------------
   Reveal notes button behavior
   - sequential, non-looping. When finished: disable button, reveal Message tab
   ------------------------------ */
btn.addEventListener('click', () => {
  if (currentIndex < notes.length) {
    noteText.textContent = notes[currentIndex];
    currentIndex++;

    if (currentIndex >= notes.length) {
      // Done with notes
      btn.disabled = true;
      btn.textContent = "No more notes";
      btn.classList.remove('primary');
      btn.style.opacity = 0.85;

      // Reveal Message tab and give gentle animation
      revealMessageTab();
    }
  }
});

function revealMessageTab(){
  // Make tab visible
  tabMsg.style.display = "inline-block";
  tabMsg.style.opacity = 0; // start transparent
  tabMsg.style.transform = "translateY(-6px)";
  // small delay to allow layout
  requestAnimationFrame(()=> {
    tabMsg.style.transition = "opacity 0.55s ease, transform 0.55s ease";
    tabMsg.style.opacity = 1;
    tabMsg.style.transform = "translateY(0)";
    // apply a gentle reveal pulse: add class that animates pseudo-element
    tabMsg.classList.add('reveal-pulse');
    // remove pulse class after animation completes
    setTimeout(()=> {
      tabMsg.classList.remove('reveal-pulse');
    }, 1200);
  });
}

/* ------------------------------
   Typewriter logic
   - Runs only first time user clicks Message tab
   - S2 speed ~45 ms / char
   - After finish: show glow + draw-on hand-drawn heart (T2 thickness)
   - Stores 'messageShown' in localStorage so it won't re-type
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

// typing speed S2 = 45 ms per character
const TYPE_SPEED = 45;
let typewriterRunning = false;

function typeWriter(el, text, speed=TYPE_SPEED, callback){
  el.textContent = '';
  let i = 0;
  typewriterRunning = true;
  function step(){
    if(i < text.length){
      el.textContent += text[i++];
      // preserve whitespace/newline rendering in the box:
      if(text[i-1] === '\n') {
        // small pause at newlines for emotional pacing
        setTimeout(step, speed * 8);
      } else {
        setTimeout(step, speed);
      }
    } else {
      typewriterRunning = false;
      if(callback) callback();
    }
  }
  step();
}

function runTypewriterIfNeeded(){
  const el = document.getElementById('messageBox');
  const shown = localStorage.getItem('messageShown');

  if(!shown){
    // run typewriter
    el.textContent = "";
    // ensure scroll to top
    el.scrollTop = 0;
    typeWriter(el, messageContent, TYPE_SPEED, ()=> {
      localStorage.setItem('messageShown','1');
      // small delay then show glow + heart
      setTimeout(()=> {
        showGlowAndHandDrawnHeart();
      }, 350);
    });
  } else {
    // already shown before — just insert the full text statically
    el.textContent = messageContent;
  }
}

/* ------------------------------
   Glow + Hand-drawn draw-on heart (D4 with H2-C style, thickness T2)
   - Append an SVG inside a wrapper in the message container
   - The SVG path will be animated stroke-dashoffset (draw-on)
   ------------------------------ */

function showGlowAndHandDrawnHeart(){
  const el = document.getElementById('messageBox');
  // Add glow class
  el.classList.add('message-glow');

  // Create a wrapper for the heart (position it bottom-right)
  const heartWrapper = document.createElement('div');
  heartWrapper.className = 'doodle-heart-wrap';
  // SVG (hand-drawn doodle path) - path sized to viewBox 0 0 120 120
  heartWrapper.innerHTML = `
    <svg class="doodle-heart" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path id="doodlePath" d="M60 102 C20 78, 6 54, 22 36 C36 20, 56 22, 60 36 C64 22, 84 20, 98 36 C114 54,100 78,60 102 Z"
        fill="none" stroke="#ff6b81" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  // append
  el.appendChild(heartWrapper);

  // prepare draw animation: compute path length and animate
  const path = heartWrapper.querySelector('#doodlePath');
  if (path) {
    const len = path.getTotalLength();
    // setup starting values
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'stroke-dashoffset 1.6s ease-in-out';
    // trigger a tiny reflow then start
    requestAnimationFrame(()=> {
      path.style.strokeDashoffset = '0';
      // after drawing finishes, do a gentle pop/settle (scale)
      setTimeout(()=> {
        heartWrapper.classList.add('doodle-heart-done');
      }, 1700);
    });
  }
}

/* ------------------------------
   Floating hearts (moderate)
   ------------------------------ */
const heartsContainer = document.getElementById('hearts');
let heartCount = 0;
const maxHearts = 12;      // moderate intensity
function spawnHeart(){
  if(heartCount >= maxHearts) return;
  heartCount++;
  const heart = document.createElement('div');
  heart.className = 'heart-float';
  heart.textContent = '❤';
  // random left position
  heart.style.left = (6 + Math.random()*88) + '%';
  heart.style.fontSize = (14 + Math.random()*22) + 'px';
  heart.style.animationDuration = (5 + Math.random()*5) + 's';
  heartsContainer.appendChild(heart);
  // remove after animation
  setTimeout(()=> {
    heart.remove(); heartCount--;
  }, 9000);
}
// spawn a heart every 700ms until maxHearts
const heartInterval = setInterval(()=> spawnHeart(), 700);

/* ------------------------------
   Accessibility / on-load defaults
   ------------------------------ */
document.addEventListener('DOMContentLoaded', ()=> {
  // Show home panel initially
  showPanel('home');

  // spawn a few hearts already for nicer initial look:
  for(let i=0;i<4;i++) setTimeout(spawnHeart, i*220);
});

