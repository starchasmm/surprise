document.addEventListener("DOMContentLoaded", () => {
  const notes = [
    "Happy Birthday, Marj!",
    "I hope for the best from you!",
    "Keep pushing to realize your dreams!",
    "I'll always be here cheering for you!",
    "But, can I borrow some of your time?",
    "This won't take long..",
    "I'm sorry to spring this up on you, but...",
    "I'm still into you..",
    "You've always been lingering in my mind..",
    "I know it's a long shot, but I'm willing to wait..",
    "I've realized this recently, for the past couple of months.",
    "But, can I borrow some of your time?",
  ];

  let notesIndex = 0;
  
  const noteElement = document.getElementById("note");
  const noteButton = document.getElementById("noteButton");
  
  noteButton.addEventListener("click", () => {
    noteElement.textContent = notes[notesIndex];
    notesIndex++;
    if (notesIndex >= notes.length) {
      notesIndex = 0;
    }
});
});
