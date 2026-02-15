document.addEventListener('DOMContentLoaded', () => {
    alert('terminal.js has started!'); // <<< DIAGNOSTIC ALERT: THIS SHOULD POP UP FIRST.

    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const terminalContainer = document.getElementById('terminal-container');
    const cursorElement = document.querySelector('.cursor');
    const rootAccessOverlay = document.getElementById('root-access-overlay');

    let commandHistory = [];
    let historyIndex = -1;
    let typingInProgress = false;

    // We'll skip the auto-typing for now with the static test content
    // const initialCommandText = "type help"; 
    // const initialCommandToExecute = "help"; 

    const commands = {
        help: {
            description: "Lists all available commands.",
            handler: cmdHelp
        },
        love_exe: {
            description: "Reveals a core sentiment.",
            handler: cmdLove
        },
        why_build: {
            description: "Explores the fundamental motivation.",
            handler: cmdWhyBuild
        },
        future_map: {
            description: "Visualizes the path forward.",
            handler: cmdFutureMap
        },
        promise_contract: {
            description: "Displays a commitment to the future.",
            handler: cmdPromiseContract
        },
        clear: {
            description: "Clears the terminal screen.",
            handler: cmdClear
        },
        exit: {
            description: "Returns to the main interface.",
            handler: cmdExit
        },
        root_access: { // Hidden command, not in help
            description: "Accesses a deeply protected segment.",
            handler: cmdRootAccess
        }
    };

    // Helper to scroll terminal output to the bottom
    function scrollToBottom() {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Simulate typing effect for output
    async function typeText(text, className = '') {
        typingInProgress = true;
        const line = document.createElement('span');
        line.className = 'response-line ' + className;
        terminalOutput.appendChild(line);

        for (let i = 0; i < text.length; i++) {
            line.textContent += text[i];
            scrollToBottom();
            await new Promise(resolve => setTimeout(resolve, 30)); // Typing speed
        }
        typingInProgress = false;
        terminalInput.focus(); // Refocus input after typing
    }

    function appendCommand(command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.textContent = `> ${command}`;
        terminalOutput.appendChild(commandLine);
        scrollToBottom();
    }

    async function executeCommand(command) {
        if (typingInProgress) return; // Prevent new commands while typing

        command = command.trim().toLowerCase();
        
        // Add to history (only if not empty and not same as last command)
        if (command !== '' && commandHistory[commandHistory.length - 1] !== command) {
            commandHistory.push(command);
            historyIndex = commandHistory.length; // Reset history index to end
        }

        const cmdHandler = commands[command.replace('.', '_')]?.handler; // Replace dot for JS object key lookup
        if (cmdHandler) {
            appendCommand(command); // Append to output before executing
            await cmdHandler();
        } else {
            appendCommand(command); // Append unknown command as well
            await typeText(`Unknown command: '${command}'. Type 'help' for a list of commands.`, 'error-line');
        }
    }

    // Command Handlers
    async function cmdHelp() {
        let response = "\nAvailable Commands:\n";
        for (const cmd in commands) {
            if (cmd === 'root_access') continue; // Hide root_access from help
            response += `  ${cmd.replace('_', '.')}: ${commands[cmd].description}\n`;
        }
        await typeText(response);
    }

    async function cmdLove() {
        const response = `
"I don’t have money yet.
But I have loyalty.
I have discipline.
I have ambition.
And I choose you."
`;
        await typeText(response, 'accent-red');
    }

    async function cmdWhyBuild() {
        const response = `
"You are the reason I stay up when quitting would be easier.
You are the reason I choose growth over comfort."
`;
        await typeText(response, 'accent-red');
    }

    async function cmdFutureMap() {
        const response = `
SYSTEM BLUEPRINT: SHARED FUTURE v1.0

  [ CORE ]
  - stable_home
  - quiet_mornings
  - shared_workspace

  [ SECURITY_LAYER ]
  - her_feeling_safe
  - no_financial_fear

  [ DEVELOPMENT_PHASE ]
  - building_together
  - continuous_growth
`;
        await typeText(response, 'accent-green');
    }

    async function cmdPromiseContract() {
        const response = `
--------------------------------------------------
  FUTURE PROMISE CONTRACT
--------------------------------------------------
Recipient:     Kiaya (Morning Dove)
Status:        In Development
Version:       1.0 → 10.0

I promise:
  > To build stability.
  > To never stop learning.
  > To protect your peace.
  > To become the man who can provide without hesitation.
  > To grow in discipline.
  > To build a life worthy of you.

Signed:        [ Your Architect ]
Build Status:  ACTIVE
--------------------------------------------------
`;
        await typeText(response, 'accent-red');
    }

    async function cmdClear() {
        terminalOutput.innerHTML = '';
        await typeText('Terminal cleared.');
    }

    async function cmdExit() {
        terminalContainer.style.opacity = '0';
        terminalContainer.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    async function cmdRootAccess() {
        rootAccessOverlay.classList.remove('hidden');
        // Trigger reflow to ensure transition works
        void rootAccessOverlay.offsetWidth; // Force reflow
        rootAccessOverlay.classList.add('fade-in');
        document.body.style.overflow = 'hidden'; // Disable scroll
        terminalInput.disabled = true;

        const handleKeypress = (e) => {
            // Prevent default behavior for arrow keys etc. that might interfere
            e.preventDefault(); 
            rootAccessOverlay.classList.remove('fade-in');
            rootAccessOverlay.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                rootAccessOverlay.classList.add('hidden');
                rootAccessOverlay.style.transition = ''; // Reset transition
                terminalInput.disabled = false;
                terminalInput.focus();
                document.body.style.overflow = 'hidden'; // Keep terminal scroll behavior
            }, 500);
            document.removeEventListener('keydown', handleKeypress);
        };
        document.addEventListener('keydown', handleKeypress);
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for effect
    }


    // Event Listeners
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission / page reload
            if (typingInProgress) return; // Prevent processing input while typing
            executeCommand(terminalInput.value);
            terminalInput.value = ''; // Clear input field
            // historyIndex is reset by executeCommand if a new command is added
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) historyIndex = commandHistory.length; // If just typed, start from last
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else if (historyIndex === commandHistory.length - 1) {
                    historyIndex = commandHistory.length; // Go past last item to empty
                    terminalInput.value = '';
                }
            }
        }
    });

    // Blinking cursor logic
    function setupCursorBlink() {
        terminalInput.addEventListener('focus', () => {
            cursorElement.style.display = 'inline-block';
        });
        terminalInput.addEventListener('blur', () => {
            cursorElement.style.display = 'none';
        });
        // Initial state
        if (document.activeElement === terminalInput) {
            cursorElement.style.display = 'inline-block';
        } else {
            cursorElement.style.display = 'none';
        }
    }


    // Initialization
    async function initTerminal() {
        terminalInput.focus();
        setupCursorBlink();
        // With the static test content, we don't need to auto-type 'help' immediately.
        // User can now directly type commands into the input field.
    }

    initTerminal();
});
