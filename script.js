const screens = Array.from(document.querySelectorAll(".screen"));
const nextButtons = document.querySelectorAll(".next");
const backButtons = document.querySelectorAll(".back");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");

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

function showScreen(index) {
  if (index < 0 || index >= screens.length) return;

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  currentScreen = index;
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });


  if (index === screens.length - 1) {
    updateScore();
}
}

function updateProgress() {
  const step = currentScreen + 1;
  const total = screens.length;
  progressLabel.textContent = `Step ${step} of ${total}`;
  progressFill.style.width = `${(step / total) * 100}%`;
}

nextButtons.forEach(button => {
  button.addEventListener("click", () => showScreen(currentScreen + 1));
});

backButtons.forEach(button => {
  button.addEventListener("click", () => showScreen(currentScreen - 1));
});

function awardPoint(key) {
  if (!scoredItems[key]) {
    scoredItems[key] = true;
    score += 1;
    updateScore();
  }
}

function removePoint(key) {
  if (scoredItems[key]) {
    scoredItems[key] = false;
    score -= 1;
    updateScore();
  }
}

function updateScore() {
  const finalScore = document.getElementById("finalScore");
  const passMessage = document.getElementById("passMessage");

  if (finalScore) {
    finalScore.textContent = score;
  }

  if (passMessage) {
    if (score >= 7) {
      passMessage.textContent = "You met the goal. You correctly applied the principle.";
      passMessage.className = "feedback good";
    } else {
      passMessage.textContent = "You have not met the goal yet. Review the pattern and try again.";
      passMessage.className = "feedback bad";
    }
  }
}

function setFeedback(id, message, type) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.remove("good", "bad", "warn");
  el.classList.add(type);
}

function clearFeedback(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  el.classList.remove("good", "bad", "warn");
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
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
    setFeedback("feedbackRecord", "Complete all four selections first.", "bad");
    removePoint("record");
    return;
  }

  const correct =
    r1 === "describe-meaning" &&
    r2 === "empty" &&
    r3 === "describe-action" &&
    r4 === "summarize-main-point";

  if (correct) {
    setFeedback("feedbackRecord", "Correct. You matched each image role to the alt text behavior that fits it best.", "good");
    awardPoint("record");
  } else {
    setFeedback("feedbackRecord", "Not quite. Recheck the relationship between the role of the image and the kind of alt text it needs.", "bad");
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
    setFeedback("feedbackHypothesis", "Write your hypothesis first.", "bad");
    removePoint("hypothesis");
    return;
  }

  const roleIdea = containsAny(answer, [
    "role",
    "purpose",
    "job",
    "context",
    "doing",
    "function"
  ]);

  const altIdea = containsAny(answer, [
    "alt",
    "alt text",
    "description"
  ]);

  const changeIdea = containsAny(answer, [
    "change",
    "changes",
    "depends",
    "depend",
    "match",
    "different",
    "based on"
  ]);

  if (roleIdea && altIdea && changeIdea) {
    setFeedback("feedbackHypothesis", "Strong hypothesis. You explained that the image’s role in context affects the alt text decision.", "good");
    awardPoint("hypothesis");
  } else {
    setFeedback("feedbackHypothesis", "You are close. Try saying that the image’s role or purpose changes what the alt text should do.", "bad");
    removePoint("hypothesis");
  }
});

document.getElementById("resetHypothesis").addEventListener("click", () => {
  resetTextarea("hypothesisText");
  clearFeedback("feedbackHypothesis");
  removePoint("hypothesis");
});

/* Informative */
document.getElementById("checkInformativeBtn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="informativeCheck"]:checked');

  if (!selected) {
    setFeedback("feedbackInformative", "Select an answer first.", "bad");
    removePoint("informative");
    return;
  }

  if (selected.value === "b") {
    setFeedback("feedbackInformative", "Correct. The best answer communicates useful meaning, not just appearance.", "good");
    awardPoint("informative");
  } else {
    setFeedback("feedbackInformative", "Not quite. Pick the answer that gives useful meaning instead of a vague label or empty alt text.", "bad");
    removePoint("informative");
  }
});

document.getElementById("resetInformativeBtn").addEventListener("click", () => {
  resetRadioGroup("informativeCheck");
  clearFeedback("feedbackInformative");
  removePoint("informative");
});

/* Decorative */
document.getElementById("checkDecorativeBtn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="decorativeCheck"]:checked');

  if (!selected) {
    setFeedback("feedbackDecorative", "Select an answer first.", "bad");
    removePoint("decorative");
    return;
  }

  if (selected.value === "b") {
    setFeedback("feedbackDecorative", "Correct. When the image is only visual styling, empty alt text is the best choice.", "good");
    awardPoint("decorative");
  } else {
    setFeedback("feedbackDecorative", "Not quite. If the image does not add meaning, it should not be described.", "bad");
    removePoint("decorative");
  }
});

document.getElementById("resetDecorativeBtn").addEventListener("click", () => {
  resetRadioGroup("decorativeCheck");
  clearFeedback("feedbackDecorative");
  removePoint("decorative");
});

/* Functional */
document.getElementById("checkFunctionalBtn").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("functionalAnswer").value);

  if (!answer) {
    setFeedback("feedbackFunctional", "Write an answer first.", "bad");
    removePoint("functional");
    return;
  }

  const actionWords = [
    "view cart",
    "open cart",
    "shopping cart",
    "cart",
    "go to cart",
    "see cart",
    "show cart",
    "open shopping cart"
  ];

  const visualOnlyWords = [
    "icon",
    "red circle",
    "small",
    "symbol",
    "graphic"
  ];

  const hasAction = containsAny(answer, actionWords);
  const visualOnly = containsAny(answer, visualOnlyWords) && !hasAction;

  if (hasAction && !visualOnly) {
    setFeedback("feedbackFunctional", "Correct. Your answer focuses on what the icon lets the user do.", "good");
    awardPoint("functional");
  } else {
    setFeedback("feedbackFunctional", "Try again. Focus on the action or purpose, not the way the icon looks.", "bad");
    removePoint("functional");
  }
});

document.getElementById("resetFunctionalBtn").addEventListener("click", () => {
  resetTextarea("functionalAnswer");
  clearFeedback("feedbackFunctional");
  removePoint("functional");
});

/* Complex */
document.getElementById("checkComplexBtn").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("complexAnswer").value);

  if (!answer) {
    setFeedback("feedbackComplex", "Write an answer first.", "bad");
    removePoint("complex");
    return;
  }

  const chartWords = [
    "chart",
    "graph",
    "revenue",
    "sales",
    "earnings",
    "income"
  ];

  const trendWords = [
    "increase",
    "increases",
    "increased",
    "grew",
    "growth",
    "rises",
    "rose",
    "upward",
    "climbs",
    "higher",
    "highest",
    "trend",
    "over time",
    "increasing",
    "grew",
    "growth"
  ];

  const nvidiaSpecificWords = [
    "nvidia",
    "ai",
    "data center",
    "segment",
    "segments",
    "market"
  ];

  const detailDumpWords = [
    "green bars",
    "red bars",
    "blue bars",
    "dates",
    "labels",
    "axis",
    "x axis",
    "y axis",
    "legend",
    "july 1",
    "jan 1",
    "market segment"
  ];

  const hasChartIdea = containsAny(answer, chartWords);
  const hasTrendIdea = containsAny(answer, trendWords);
  const hasUsefulFocus = containsAny(answer, nvidiaSpecificWords) || answer.length > 70;
  const detailOnly = containsAny(answer, detailDumpWords) && !hasTrendIdea;

  if (hasChartIdea && hasTrendIdea && hasUsefulFocus && !detailOnly) {
    setFeedback("feedbackComplex", "Good. You summarized the main takeaway instead of listing visual details.", "good");
    awardPoint("complex");
  } else {
    setFeedback("feedbackComplex", "Try again. Focus on the overall trend or the main part that stands out most.", "bad");
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
    setFeedback("feedbackPractice1", "Select an answer first.", "bad");
    removePoint("practice1");
    return;
  }

  if (selected.value === "c") {
    setFeedback("feedbackPractice1", "Correct. This image needs a summary of its main point rather than a simple label.", "good");
    awardPoint("practice1");
  } else {
    setFeedback("feedbackPractice1", "Not quite. Think about how much information the image contains and whether it needs summarizing.", "bad");
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
    setFeedback("feedbackPractice2", "Select an answer first.", "bad");
    removePoint("practice2");
    return;
  }

  if (selected.value === "b") {
    setFeedback("feedbackPractice2", "Correct. The strongest answer explains the meaning of the image in context.", "good");
    awardPoint("practice2");
  } else {
    setFeedback("feedbackPractice2", "Not quite. Pick the answer that communicates useful meaning, not just visible objects.", "bad");
    removePoint("practice2");
  }
});

document.getElementById("resetPractice2Btn").addEventListener("click", () => {
  resetRadioGroup("practice2");
  clearFeedback("feedbackPractice2");
  removePoint("practice2");
});

/* Final */
document.getElementById("checkFinalBtn").addEventListener("click", () => {
  const answer = normalizeText(document.getElementById("finalAnswer").value);

  if (!answer) {
    setFeedback("feedbackFinal", "Write an answer first.", "bad");
    removePoint("final");
    return;
  }

  const actionWords = [
    "view cart",
    "open cart",
    "shopping cart",
    "cart",
    "bag",
    "shopping bag",
    "open bag",
    "view bag",
    "online shopping"
  ];

  const visualOnlyWords = [
    "bag icon",
    "cart icon",
    "small icon",
    "button image",
    "toolbar icon",
    "selecting",
    "Select"
  ];

  const hasAction = containsAny(answer, actionWords);
  const visualOnly = containsAny(answer, visualOnlyWords) && !hasAction;

  if (hasAction && !visualOnly) {
    setFeedback("feedbackFinal", "Correct. Your answer focuses on what the navigation icon does.", "good");
    awardPoint("final");
  } else {
    setFeedback("feedbackFinal", "Try again. Focus on the action or purpose of the bag icon.", "bad");
    removePoint("final");
  }
});

document.getElementById("resetFinalBtn").addEventListener("click", () => {
  resetTextarea("finalAnswer");
  clearFeedback("feedbackFinal");
  removePoint("final");
});

/* Restart */
document.getElementById("restartLesson").addEventListener("click", () => {
  Object.keys(scoredItems).forEach(key => {
    scoredItems[key] = false;
  });

  score = 0;
  updateScore();

  resetSelect("role1");
  resetSelect("role2");
  resetSelect("role3");
  resetSelect("role4");

  resetTextarea("hypothesisText");
  resetRadioGroup("informativeCheck");
  resetRadioGroup("decorativeCheck");
  resetTextarea("functionalAnswer");
  resetTextarea("complexAnswer");
  resetRadioGroup("practice1");
  resetRadioGroup("practice2");
  resetTextarea("finalAnswer");

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
updateScore();
