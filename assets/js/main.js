document.addEventListener('DOMContentLoaded', () => {
    const bootSequence = [
        "initializing runtime...",
        "loading core modules...",
        "scanning emotional memory...",
        "locating purpose...",
        "purpose detected.",
        "compiling future...",
        "reason found: Morning Dove"
    ];

    const bootTextElement = document.getElementById('boot-text');
    const bootScreen = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');
    const enterWorldButton = document.getElementById('enter-world-button');

    let lineIndex = 0;
    let charIndex = 0;
    const typingSpeed = 50; // milliseconds per character
    const lineDelay = 800;  // milliseconds between lines

    function typeBootText() {
        if (lineIndex < bootSequence.length) {
            if (charIndex < bootSequence[lineIndex].length) {
                bootTextElement.innerHTML += bootSequence[lineIndex][charIndex];
                charIndex++;
                setTimeout(typeBootText, typingSpeed);
            } else {
                bootTextElement.innerHTML += '<br>'; // New line character
                lineIndex++;
                charIndex = 0;
                setTimeout(typeBootText, lineDelay);
            }
        } else {
            // All lines typed, transition to main content
            setTimeout(fadeTransitionToMainContent, lineDelay * 1.5);
        }
    }

    function fadeTransitionToMainContent() {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Trigger reflow to ensure transition works
            void mainContent.offsetWidth; // Force reflow
            mainContent.classList.add('fade-in');
            document.body.style.overflow = 'auto'; // Allow scrolling on main content
        }, parseInt(getComputedStyle(bootScreen).transitionDuration) * 1000);
    }

    enterWorldButton.addEventListener('click', () => {
        mainContent.classList.remove('fade-in');
        mainContent.style.opacity = '0'; // Explicitly set opacity to 0 for fade-out
        setTimeout(() => {
            window.location.href = 'terminal.html';
        }, parseInt(getComputedStyle(mainContent).transitionDuration) * 1000);
    });

    // Start the boot sequence
    typeBootText();
});
