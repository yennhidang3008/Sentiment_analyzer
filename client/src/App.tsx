/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useRef, useState } from "react";

function App() {
  const [text, setText] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [sentiment, setSentiment] = useState<string>("");
  const [progress, setProgress] = useState<boolean>(false);
  const naiveBayesRef = useRef(null);
  const maxentRef = useRef(null);
  const annRef = useRef(null);
  const handleType = (type: string, ref: string) => {
    if (ref === "nb") {
      (maxentRef.current as any).style.border = "none";
      (annRef.current as any).style.border = "none";
      (naiveBayesRef.current as any).style.border = "2px solid white";
    } else if (ref === "mx") {
      (naiveBayesRef.current as any).style.border = "none";
      (annRef.current as any).style.border = "none";
      (maxentRef.current as any).style.border = "2px solid white";
    } else if (ref === "ann") {
      (maxentRef.current as any).style.border = "none";
      (naiveBayesRef.current as any).style.border = "none";
      (annRef.current as any).style.border = "2px solid white";
    }
    setType(type);
  };
  const runModel = async () => {
    if (text.trim() === "") {
      alert("Please enter a text...");
      return;
    }
    if (type === "") {
      alert("Please select a Model type");
      return;
    }
    setProgress(true);
    const res = await axios.post(
      "https://sentiment-analysis-api-aqfj.onrender.com",
      {
        review: text,
        type,
      }
    );
    const data = res.data;
    setSentiment(data?.review);
    setProgress(false);
  };
  return (
    <div className="relative h-[100vh] w-[100vw] bg-slate-900 flex items-center justify-center">
      <div className="w-full lg:max-w-[800px] lg:mx-auto -mt-4">
        <div className="px-4 py-2 text-4xl font-semibold text-center text-white">
          <div className="mt-2">Sentiment Analyzer</div>
          <div className="mt-5">
            <textarea
              onChange={(e) => setText(e.target.value)}
              defaultValue={text}
              placeholder="Please enter here..."
              className="min-h-[450px] text-lg p-3 resize-none focus:border-blue-500 border-[3px] transition-all delay-200 shadow-2xl border-gray-400 rounded-md text-gray-900 outline-none lg:max-w-[1000px] lg:w-full max-w-[450px] w-full"
            ></textarea>
            <div className="flex lg:max-w-[1000px] mx-auto lg:w-full max-w-[450px] w-full">
              <div className="flex flex-col gap-3 mt-3 text-2xl">
                <button
                  ref={naiveBayesRef}
                  onClick={() => handleType("naivebayes", "nb")}
                  className="px-3 py-1 bg-orange-500 rounded-md whitespace-nowrap"
                >
                  Naïve Bayes
                </button>
                <button
                  ref={maxentRef}
                  onClick={() => handleType("maxent", "mx")}
                  className="px-3 py-1 bg-pink-500 rounded-md whitespace-nowrap"
                >
                  Maxent
                </button>
                <button
                  ref={annRef}
                  onClick={() => handleType("ann", "ann")}
                  className="px-3 py-1 bg-yellow-500 rounded-md whitespace-nowrap"
                >
                  ANN
                </button>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="py-2">
                  {progress ? (
                    <div className="w-10 h-10 border-2 rounded-full border-slate-100 border-b-transparent border-t-transparent animate-spin"></div>
                  ) : sentiment === "" ? (
                    <div className="w-10 h-10"></div>
                  ) : sentiment === "positive" ? (
                    <span className="text-green-400">Positive</span>
                  ) : (
                    <span className="text-red-400">Negative</span>
                  )}
                </div>
                <div className="mt-5">
                  <button
                    onClick={runModel}
                    className="px-4 py-3 text-xl bg-blue-500 rounded-md"
                  >
                    Run Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
