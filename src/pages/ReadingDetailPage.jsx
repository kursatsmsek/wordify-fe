import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DropdownSection from "../components/DropdownSection";

export default function ReadingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchReading() {
      setLoading(true);
      setError("");
      try {
        // TODO: Replace with actual API call when backend is ready
        // const res = await readingsApi.getById(id);
        // setReading(res);

        // Mock data for demonstration
        if (id === "new") {
          // TODO: This will be replaced with AI-generated content
          setReading({
            id: "demo-1",
            passage_en:
              "The university team decided to carry out a detailed study to assess the impact of renewable energy projects on local communities. Their significant findings will help establish new guidelines and provide clear recommendations for future initiatives. To achieve reliable results, the researchers required access to all available data sources and involved several experts from different fields. Throughout the process, they made sure to identify key variables, maintain rigorous standards, and demonstrate how each contribution could improve outcomes. The final report will ensure that policymakers can assess the effectiveness of the programs and decide which actions to require for sustainable development.",
            passage_tr:
              "Üniversite ekibi, yerel topluluklar üzerindeki yenilenebilir enerji projelerinin etkisini değerlendirmek için ayrıntılı bir çalışma yürütmeye karar verdi. Önemli bulguları, yeni yönergeler oluşturacak ve gelecekteki girişimler için açık tavsiyeler sağlayacak. Güvenilir sonuçlara ulaşmak için araştırmacılar tüm mevcut veri kaynaklarına erişim gerekti ve farklı alanlardan birçok uzmanı sürece dahil etti. Süreç boyunca, ana değişkenleri belirledi, sıkı standartları sürdürdü ve her katkının sonuçları nasıl iyileştirebileceğini gösterdi. Nihai rapor, politika yapıcıların programların etkinliğini değerlendirmesini ve sürdürülebilir kalkınma için hangi adımların gerekli olduğunu karar vermesini sağlayacak.",
            target_words: [
              { word: "carry out", meaning_tr: "gerçekleştirmek" },
              { word: "significant", meaning_tr: "önemli" },
              { word: "establish", meaning_tr: "kurmak" },
              { word: "contribution", meaning_tr: "katkı" },
              { word: "demonstrate", meaning_tr: "göstermek" },
              { word: "assess", meaning_tr: "değerlendirmek" },
              { word: "achieve", meaning_tr: "başarmak" },
              { word: "require", meaning_tr: "gerektirmek" },
              { word: "available", meaning_tr: "mevcut" },
              { word: "process", meaning_tr: "süreç" },
              { word: "ensure", meaning_tr: "sağlamak" },
              { word: "identify", meaning_tr: "belirlemek" },
              { word: "involve", meaning_tr: "dahil etmek" },
              { word: "maintain", meaning_tr: "sürdürmek" },
              { word: "provide", meaning_tr: "sağlamak" },
            ],
            extra_words: [{ word: "survey", meaning_tr: "anket" }],
            questions: [
              {
                question: "What did the researchers carry out?",
                options: [
                  { id: "A", text: "A medical experiment" },
                  { id: "B", text: "A detailed study on renewable energy" },
                  { id: "C", text: "A language study" },
                  { id: "D", text: "A financial review" },
                ],
                answer: "B",
              },
              {
                question: "Which word describes the importance of the findings?",
                options: [
                  { id: "A", text: "significant" },
                  { id: "B", text: "available" },
                  { id: "C", text: "maintain" },
                  { id: "D", text: "process" },
                ],
                answer: "A",
              },
              {
                question:
                  "What must policymakers do after reading the report?",
                options: [
                  { id: "A", text: "Establish new laws" },
                  { id: "B", text: "Assess the effectiveness" },
                  { id: "C", text: "Provide funding" },
                  { id: "D", text: "Maintain current policies" },
                ],
                answer: "B",
              },
              {
                question: "Which action was required to obtain reliable results?",
                options: [
                  {
                    id: "A",
                    text: "Access to all available data sources",
                  },
                  { id: "B", text: "To carry out a field trip" },
                  { id: "C", text: "To demonstrate a hypothesis" },
                  { id: "D", text: "To maintain equipment" },
                ],
                answer: "A",
              },
              {
                question: "What does the passage say the researchers will provide?",
                options: [
                  { id: "A", text: "Clear recommendations" },
                  { id: "B", text: "Financial support" },
                  { id: "C", text: "New technology" },
                  { id: "D", text: "Training sessions" },
                ],
                answer: "A",
              },
            ],
          });
        } else {
          throw new Error("Reading not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch reading.");
      } finally {
        setLoading(false);
      }
    }
    fetchReading();
  }, [id]);

  const handleAnswerSelect = (questionIndex, optionId) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    if (!reading) return 0;
    let correct = 0;
    reading.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });
    return Math.round((correct / reading.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-3xl space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-slate-800 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl p-6 text-rose-700 dark:text-rose-400">
          <div className="flex gap-3 items-start">
            <span className="material-symbols-outlined text-lg flex-shrink-0">
              error
            </span>
            <div>
              <h3 className="font-semibold mb-1">Error</h3>
              <p>{error}</p>
              <button
                onClick={() => navigate("/readings")}
                className="mt-4 text-sm font-medium underline hover:no-underline"
              >
                Back to Readings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/readings")}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity text-sm font-medium"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Readings
        </button>

        {/* Passage Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 animate-pop-in">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-8 leading-relaxed">
            {reading.passage_en}
          </h1>

          {/* Dropdown Sections */}
          <div className="space-y-3 mt-8">
            <DropdownSection title="🇹🇷 Turkish Translation">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                {reading.passage_tr}
              </p>
            </DropdownSection>

            <DropdownSection title="🎯 Target Words">
              <div className="space-y-2">
                {reading.target_words.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 py-2 px-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {item.word}
                      </p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {item.meaning_tr}
                    </p>
                  </div>
                ))}
              </div>
            </DropdownSection>

            <DropdownSection title="➕ Extra Words">
              <div className="space-y-2">
                {reading.extra_words.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 py-2 px-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {item.word}
                      </p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {item.meaning_tr}
                    </p>
                  </div>
                ))}
              </div>
            </DropdownSection>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Comprehension Questions
          </h2>

          {reading.questions.map((question, qIdx) => (
            <div
              key={qIdx}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 animate-pop-in"
              style={{ animationDelay: `${qIdx * 50}ms` }}
            >
              <p className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
                <span className="text-primary mr-2">{qIdx + 1}.</span>
                {question.question}
              </p>

              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = selectedAnswers[qIdx] === option.id;
                  const isCorrect = option.id === question.answer;
                  const showResult = submitted && isSelected;
                  const showCorrectOption = submitted && isCorrect;

                  let buttonClass =
                    "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5";

                  if (submitted) {
                    if (showCorrectOption) {
                      buttonClass =
                        "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                    } else if (showResult) {
                      buttonClass =
                        "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                    } else if (isSelected) {
                      buttonClass =
                        "border-slate-200 dark:border-slate-700 text-slate-400";
                    }
                  } else if (isSelected) {
                    buttonClass =
                      "border-primary bg-primary/10 text-slate-900 dark:text-slate-100 dark:bg-primary/20";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(qIdx, option.id)}
                      disabled={submitted}
                      className={`w-full p-4 rounded-lg font-medium text-sm transition-all text-left border-2 flex items-center gap-3 ${buttonClass}`}
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border-2 border-current font-bold text-xs">
                        {option.id}
                      </span>
                      <span className="flex-1">{option.text}</span>
                      {submitted && showCorrectOption && (
                        <span className="material-symbols-outlined flex-shrink-0 text-lg">
                          check_circle
                        </span>
                      )}
                      {submitted && showResult && (
                        <span className="material-symbols-outlined flex-shrink-0 text-lg">
                          cancel
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        {submitted && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center animate-fade-up">
            <div className="flex justify-center mb-6">
              <div
                className={`flex items-center justify-center w-20 h-20 rounded-full font-bold text-2xl ${
                  calculateScore() >= 70
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : calculateScore() >= 50
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                }`}
              >
                {calculateScore()}%
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You got {Object.values(selectedAnswers).filter((a, idx) => a === reading.questions[idx].answer).length} out of{" "}
              {reading.questions.length} questions correct.
            </p>
            <button
              onClick={handleReset}
              className="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Submit Button */}
        {!submitted && Object.keys(selectedAnswers).length === reading.questions.length && (
          <button
            onClick={handleSubmit}
            className="bg-primary hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">check</span>
            Submit Answers
          </button>
        )}

        {/* Instruction */}
        {!submitted && Object.keys(selectedAnswers).length < reading.questions.length && (
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Answer all questions ({Object.keys(selectedAnswers).length}/{reading.questions.length}) to submit
          </p>
        )}

        <div className="h-10" />
      </div>
    </div>
  );
}
