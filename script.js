const screens = Array.from(document.querySelectorAll(".screen"));
const nextButtons = document.querySelectorAll(".next");
const backButtons = document.querySelectorAll(".back");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const allAudios = document.querySelectorAll("audio");

let currentScreen = 0;
let score = 0;

const scoredItems = {
  record: false,
  hypothesis: false,
  informative: false,
  decorative: false,
  functional: false,
  complex: false,
  practice1: false,
  practice2: false,
  final: false
};

function stopAllAudio() {
  allAudios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function showScreen(index) {
  if (index < 0 || index >= screens.length) return;

  stopAllAudio();

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  currentScreen = index;
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  const step = currentScreen + 1;
  const total = screens.length;
  progressLabel.textContent = `Step ${step} of ${total}`;
  progressFill.style.width = `${(step / total) * 100}%`;
}

nextButtons.forEach(button => {
  button.addEventListener("click", () => {
    showScreen(currentScreen + 1);
  });
});

backButtons.forEach(button => {
  button.addEventListener("click", () => {
    showScreen(currentScreen - 1);
  });
});

function awardPoint(key) {
  if (!scoredItems[key]) {
    scoredItems[key] = true;
    score += 1;
    updateFinalScore();
  }
}

function removePoint(key) {
  if (scoredItems[key]) {
    scoredItems[key] = false;
    score -= 1;
    updateFinalScore();
  }
}

function updateFinalScore() {
  const scoreSpan = document.getElementById("finalScore");
  if (scoreSpan) {
    scoreSpan.textContent = score;
  }
}

function setFeedback(elementId, message, isCorrect) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.remove("good", "bad", "warn");
  el.classList.add(isCorrect ? "good" : "bad");
}

function clearFeedback(elementId) {
  const el = document.getElementById(elementId);
  el.textContent = "";
  el.classList.remove("good", "bad", "warn");
}

function normalizeText(text) {
  return text.toLowerCase().trim();
}

function containsAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function resetRadioGroup(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  if (checked) checked.checked = false;
}

function resetTextarea(id) {
  document.getElementById(id).value = "";
}

function resetSelect(id) {
  document.getElementById(id).selectedIndex = 0;
}

/* Track the Pattern */
document.getElementById("checkRecord").addEventListener("click", () => {
  const r1 = document.getElementById("role1").value;
  const r2 = document.getElementById("role2").value;
  const r3 = document.getElementById("role3").value;
  const r4 = document.getElementById("role4").value;

  if (!r1 || !r2 || !r3 || !r4) {
    setFeedback("feedbackRecord", "Complete all four selections first.", false);
    removePoint("record");
    return;
  }

  const correct =
    r1 === "describe-meaning" &&
    r2 === "empty" &&
    r3 === "describe-action" &&
    r4 === "summarize-main-point";

  if (correct) {
    setFeedback("feedbackRecord", "Good. You matched each image role to the correct alt text behavior.", true);
    awardPoint("record");
  } else {
    setFeedback("feedbackRecord", "Not quite. Recheck the cause-and-effect pattern: when the image role changes, the alt text behavior should change too.", false);
    removePoint("record");
  }
});

document.getElementById("resetRecord").addEventListener("click", () => {
  resetSelect("role1");
  resetSelect("role2");
  resetSelect("role3");
  resetSelect("role4");
  clearFeedback("feedbackRecord");
  removePoint("record");
});

/* Hypothesis */
document.getElementById("checkHypothesis").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("hypothesisText").value);

  if (!answer) {
    setFeedback("feedbackHypothesis", "Write your hypothesis first.", false);
    removePoint("hypothesis");
    return;
  }

  const hasRoleIdea = containsAny(answer, ["role", "purpose", "doing", "context"]);
  const hasAltIdea = containsAny(answer, ["alt", "alt text"]);
  const hasBehaviorIdea = containsAny(answer, ["describe", "empty", "summarize", "action", "meaning", "change"]);
  const hasCauseEffect = containsAny(answer, ["when", "if"]) && containsAny(answer, ["changes", "change"]);

  if (hasRoleIdea && hasAltIdea && hasBehaviorIdea && hasCauseEffect) {
    setFeedback("feedbackHypothesis", "Strong hypothesis. You connected the cause-and-effect pattern: when image role changes, alt text behavior changes.", true);
    awardPoint("hypothesis");
  } else {
    setFeedback("feedbackHypothesis", "You are close. Try stating that when the role of the image changes, the alt text should change as well.", false);
    removePoint("hypothesis");
  }
});

document.getElementById("resetHypothesis").addEventListener("click", () => {
  resetTextarea("hypothesisText");
  clearFeedback("feedbackHypothesis");
  removePoint("hypothesis");
});

/* Check 1 Informative */
document.getElementById("checkInformativeBtn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="informativeCheck"]:checked');

  if (!selected) {
    setFeedback("feedbackInformative", "Select an answer first.", false);
    removePoint("informative");
    return;
  }

  if (selected.value === "b") {
    setFeedback("feedbackInformative", "Correct. This works because the image is informative, so the alt text should communicate the meaning.", true);
    awardPoint("informative");
  } else {
    setFeedback("feedbackInformative", "Not quite. Because the role here is informative, the alt text should communicate meaning, not decoration or vagueness.", false);
    removePoint("informative");
  }
});

document.getElementById("resetInformativeBtn").addEventListener("click", () => {
  resetRadioGroup("informativeCheck");
  clearFeedback("feedbackInformative");
  removePoint("informative");
});

/* Check 2 Decorative */
document.getElementById("checkDecorativeBtn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="decorativeCheck"]:checked');

  if (!selected) {
    setFeedback("feedbackDecorative", "Select an answer first.", false);
    removePoint("decorative");
    return;
  }

  if (selected.value === "b") {
    setFeedback("feedbackDecorative", "Correct. Because the image is decorative and adds no meaning, it should use empty alt text.", true);
    awardPoint("decorative");
  } else {
    setFeedback("feedbackDecorative", "Not quite. Because this image is decorative, the alt text behavior should change to empty alt text.", false);
    removePoint("decorative");
  }
});

document.getElementById("resetDecorativeBtn").addEventListener("click", () => {
  resetRadioGroup("decorativeCheck");
  clearFeedback("feedbackDecorative");
  removePoint("decorative");
});

/* Check 3 Functional */
document.getElementById("checkFunctionalBtn").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("functionalAnswer").value);

  if (!answer) {
    setFeedback("feedbackFunctional", "Write an answer first.", false);
    removePoint("functional");
    return;
  }

  const actionWords = ["view cart", "open cart", "shopping cart", "cart"];
  const visualWordsOnly = ["red", "circle", "icon", "small", "symbol"];

  const hasAction = containsAny(answer, actionWords);
  const mostlyVisual = containsAny(answer, visualWordsOnly) && !hasAction;

  if (hasAction && !mostlyVisual) {
    setFeedback("feedbackFunctional", "Good. Because the image is functional, the alt text should describe the action or purpose.", true);
    awardPoint("functional");
  } else {
    setFeedback("feedbackFunctional", "Try again. Because the role is functional, the alt text behavior should change to describing the action or purpose.", false);
    removePoint("functional");
  }
});

document.getElementById("resetFunctionalBtn").addEventListener("click", () => {
  resetTextarea("functionalAnswer");
  clearFeedback("feedbackFunctional");
  removePoint("functional");
});

/* Check 4 Complex */
document.getElementById("checkComplexBtn").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("complexAnswer").value);

  if (!answer) {
    setFeedback("feedbackComplex", "Write an answer first.", false);
    removePoint("complex");
    return;
  }

  const trendWords = ["increase", "increased", "growth", "grew", "revenue", "data center", "ai"];
  const detailDumpWords = ["blue", "orange", "green", "labels", "many bars", "dates"];

  const hasTrend = containsAny(answer, trendWords);
  const detailOnly = containsAny(answer, detailDumpWords) && !hasTrend;

  if (hasTrend && !detailOnly) {
    setFeedback("feedbackComplex", "Good. Because the image is complex, the alt text should summarize the main takeaway.", true);
    awardPoint("complex");
  } else {
    setFeedback("feedbackComplex", "Try again. Because the role is complex, the alt text behavior should change to summarizing the main point rather than listing details.", false);
    removePoint("complex");
  }
});

document.getElementById("resetComplexBtn").addEventListener("click", () => {
  resetTextarea("complexAnswer");
  clearFeedback("feedbackComplex");
  removePoint("complex");
});

/* Practice 1 */
document.getElementById("checkPractice1Btn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="practice1"]:checked');

  if (!selected) {
    setFeedback("feedbackPractice1", "Select an answer first.", false);
    removePoint("practice1");
    return;
  }

  if (selected.value === "c") {
    setFeedback("feedbackPractice1", "Correct. Because the graph contains substantial information and trends, its role is complex.", true);
    awardPoint("practice1");
  } else {
    setFeedback("feedbackPractice1", "Not quite. Think about the amount of information the image carries. That role affects the alt text behavior.", false);
    removePoint("practice1");
  }
});

document.getElementById("resetPractice1Btn").addEventListener("click", () => {
  resetRadioGroup("practice1");
  clearFeedback("feedbackPractice1");
  removePoint("practice1");
});

/* Practice 2 */
document.getElementById("checkPractice2Btn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="practice2"]:checked');

  if (!selected) {
    setFeedback("feedbackPractice2", "Select an answer first.", false);
    removePoint("practice2");
    return;
  }

  if (selected.value === "b") {
    setFeedback("feedbackPractice2", "Correct. Because the image is informative in this context, the best alt text communicates the meaning.", true);
    awardPoint("practice2");
  } else {
    setFeedback("feedbackPractice2", "Not quite. Look for the answer that matches the image’s role in context. Here, that means communicating meaning rather than appearance only.", false);
    removePoint("practice2");
  }
});

document.getElementById("resetPractice2Btn").addEventListener("click", () => {
  resetRadioGroup("practice2");
  clearFeedback("feedbackPractice2");
  removePoint("practice2");
});

/* Final Challenge */
document.getElementById("checkFinalBtn").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("finalAnswer").value);

  if (!answer) {
    setFeedback("feedbackFinal", "Write your alt text first.", false);
    removePoint("final");
    return;
  }

  const strongKeywords = ["contact", "open contact form", "contact form", "email", "message", "contact us"];
  const weakVisualOnly = ["icon", "envelope", "small", "symbol"];

  const strong = containsAny(answer, strongKeywords);
  const weakOnly = containsAny(answer, weakVisualOnly) && !strong;

  if (strong && !weakOnly) {
    setFeedback("feedbackFinal", "Strong answer. You recognized that this is a functional image, so the alt text should describe the action or purpose.", true);
    awardPoint("final");
  } else {
    setFeedback("feedbackFinal", "Revise it. Ask what the image does in context. Because this role is functional, the alt text should describe the action or purpose, such as opening the contact form.", false);
    removePoint("final");
  }
});

document.getElementById("resetFinalBtn").addEventListener("click", () => {
  resetTextarea("finalAnswer");
  clearFeedback("feedbackFinal");
  removePoint("final");
});

document.getElementById("restartLesson").addEventListener("click", () => {
  stopAllAudio();

  score = 0;
  Object.keys(scoredItems).forEach(key => {
    scoredItems[key] = false;
  });
  updateFinalScore();

  resetSelect("role1");
  resetSelect("role2");
  resetSelect("role3");
  resetSelect("role4");
  resetTextarea("hypothesisText");
  resetTextarea("functionalAnswer");
  resetTextarea("complexAnswer");
  resetTextarea("finalAnswer");

  resetRadioGroup("informativeCheck");
  resetRadioGroup("decorativeCheck");
  resetRadioGroup("practice1");
  resetRadioGroup("practice2");

  [
    "feedbackRecord",
    "feedbackHypothesis",
    "feedbackInformative",
    "feedbackDecorative",
    "feedbackFunctional",
    "feedbackComplex",
    "feedbackPractice1",
    "feedbackPractice2",
    "feedbackFinal"
  ].forEach(clearFeedback);

  showScreen(0);
});

updateProgress();
updateFinalScore();