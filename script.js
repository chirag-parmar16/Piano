document.addEventListener("DOMContentLoaded", async () => {
  const pianoKeys = document.querySelectorAll(".key");
  let audioContext;

  // Frequencies for three octaves (C3 to B5)
  const noteFrequencies = {
    // First Octave (C3-B3)
    C3: 130.81,
    "C#3": 138.59,
    D3: 146.83,
    "D#3": 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185.0,
    G3: 196.0,
    "G#3": 207.65,
    A3: 220.0,
    "A#3": 233.08,
    B3: 246.94,

    // Second Octave (C4-B4)
    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
    B4: 493.88,

    // Third Octave (C5-B5)
    C5: 523.25,
    "C#5": 554.37,
    D5: 587.33,
    "D#5": 622.25,
    E5: 659.25,
    F5: 698.46,
    "F#5": 739.99,
    G5: 783.99,
    "G#5": 830.61,
    A5: 880.0,
    "A#5": 932.33,
    B5: 987.77,
  };

  // Initialize audio context on first user interaction
  async function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Function to create a piano-like sound
  function createPianoSound(frequency) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Set up oscillator with a more piano-like waveform
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Set up gain envelope for piano-like sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.1,
      audioContext.currentTime + 0.5
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1.5
    );

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start and stop the sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.5);
  }

  // Function to play a note
  function playNote(note) {
    if (!audioContext) {
      console.log("Audio not initialized yet");
      return;
    }

    const frequency = noteFrequencies[note];
    if (frequency) {
      createPianoSound(frequency);
    } else {
      console.log(`Frequency not found for note ${note}`);
    }
  }

  // Add click event listeners to piano keys
  pianoKeys.forEach((key) => {
    key.addEventListener("click", async () => {
      await initAudio(); // Initialize audio on first click
      const note = key.dataset.note;
      playNote(note);

      // Add visual feedback
      key.classList.add("pressed");
      setTimeout(() => {
        key.classList.remove("pressed");
      }, 200);
    });
  });

  // Map keyboard keys to piano notes
  const keyboardNoteMap = {
    // First Octave (C3-B3)
    z: "C3",
    s: "C#3",
    x: "D3",
    d: "D#3",
    c: "E3",
    v: "F3",
    g: "F#3",
    b: "G3",
    h: "G#3",
    n: "A3",
    j: "A#3",
    m: "B3",

    // Second Octave (C4-B4)
    q: "C4",
    2: "C#4",
    w: "D4",
    3: "D#4",
    e: "E4",
    r: "F4",
    5: "F#4",
    t: "G4",
    6: "G#4",
    y: "A4",
    7: "A#4",
    u: "B4",

    // Third Octave (C5-B5)
    i: "C5",
    9: "C#5",
    o: "D5",
    0: "D#5",
    p: "E5",
    "[": "F5",
    "=": "F#5",
    "]": "G5",
    "\\": "G#5",
    ";": "A5",
    "'": "A#5",
    Enter: "B5",
  };

  // Add keyboard event listeners
  document.addEventListener("keydown", async (event) => {
    const key = event.key.toLowerCase();
    if (keyboardNoteMap[key]) {
      await initAudio(); // Initialize audio on first key press
      const note = keyboardNoteMap[key];
      playNote(note);

      // Add visual feedback
      const pianoKey = document.querySelector(`.key[data-note="${note}"]`);
      if (pianoKey) {
        pianoKey.classList.add("pressed");
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (keyboardNoteMap[key]) {
      const note = keyboardNoteMap[key];
      // Remove visual feedback
      const pianoKey = document.querySelector(`.key[data-note="${note}"]`);
      if (pianoKey) {
        setTimeout(() => {
          pianoKey.classList.remove("pressed");
        }, 100);
      }
    }
  });

  // Toggle note labels visibility
  const toggleButton = document.getElementById("toggle-labels");
  const body = document.body;

  toggleButton.addEventListener("click", () => {
    body.classList.toggle("show-labels");
  });

  // Tab functionality for key map
  const tabs = document.querySelectorAll("[data-tab-target]");
  const tabContents = document.querySelectorAll("[data-tab-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.tabTarget);

      tabContents.forEach((tabContent) => {
        tabContent.classList.remove("active");
      });
      tabs.forEach((tabItem) => {
        tabItem.classList.remove("active");
      });

      tab.classList.add("active");
      target.classList.add("active");
    });
  });
});
