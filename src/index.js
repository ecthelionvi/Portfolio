let userInput, terminalOutput;

const app = () => {
  window.userInput = document.getElementById("userInput");
  window.terminalOutput = document.getElementById("terminalOutput");
  document.getElementById("dummyKeyboard").focus();
};

document.addEventListener("DOMContentLoaded", (event) => {
  app();
});

const execute = function executeCommand(input) {
  let output;
  input = input.toLowerCase();

  if (input.length === 0) {
    return;
  }

  if (input === "clear") {
    window.terminalOutput.innerHTML = welcomeMessage();
    window.userInput.innerHTML = "";
    return;
  }

  output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
  if (!COMMANDS.hasOwnProperty(input)) {
    output += `<div class="terminal-line">no such command: <span class="output">"${input}"</span></div>`;
  } else {
    output += `<div class="output"> ${COMMANDS[input]} </div>`;
  }

  window.terminalOutput.innerHTML = `${window.terminalOutput.innerHTML}<div class="terminal-line">${output}</div>`;
  window.terminalOutput.scrollTop = window.terminalOutput.scrollHeight;
};

const key = function keyEvent(e) {
  const input = window.userInput.innerHTML;

  if (e.key === "Enter") {
    execute(input);
    window.userInput.innerHTML = "";
    return;
  }

  window.userInput.innerHTML = input + e.key;
};

const backspace = function backSpaceKeyEvent(e) {
  if (e.keyCode !== 8 && e.keyCode !== 46) {
    return;
  }
  window.userInput.innerHTML = window.userInput.innerHTML.slice(
    0,
    window.userInput.innerHTML.length - 1
  );
};

const welcomeMessage = () => {
  return `<div class="terminal-line">
            <span class="help-msg">Welcome to my Portfolio! — Type
              <span class="code">help</span> for a list of supported
              commands.
            </span>
          </div>`;
};

document.addEventListener("keydown", backspace);
document.addEventListener("keypress", key);

const COMMANDS = {
  help: 'Supported Commands: ["<span class="code">about</span>", "<span class="code">experience</span>", "<span class="code">education</span>", "<span class="code">skills</span>", "<span class="code">contact</span>"]',
  about:
    "Hello 👋<br>I'm Robert Sears. I'm an Army veteran turned computer science student who loves coding and web development. In my free time, I powerlift, cherish my moments with my cat, and contribute to the veteran community. I'm all about growing, connecting with others, and using tech to make a difference.",
  skills:
    '<span class="code">Languages:</span> HTML, CSS, Python, JavaScript<br><span class="code">Technologies:</span> Git, PostgreSQL, REST API\'s<br><span class="code">Frameworks:</span> React, Django',
  education:
    "B.S. Computer Science - University of Nebraska-Lincoln",
  experience:
    "I'm currently working as a Teaching Assistant at Code Platoon. I help provide comprehensive training to over 30 military veterans and spouses, focusing on Full Stack Development. I collaborate closely with other faculty members to improve the curriculum and enhance the in-class experience.",
  contact:
    'You can contact me on any of the following links:<br>["<a target="_blank" rel="noopener noreferrer" href="https://github.com/ecthelionvi" class="social link">GitHub</a>", "<a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/robert-sears-" class="social link">LinkedIn</a>"]',
  merlin: "<span style='font-size: 2rem;'>🐈‍⬛</span>",
};
