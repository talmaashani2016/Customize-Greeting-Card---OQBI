import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

import Joyride, { STATUS } from "react-joyride";

import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from "../config/motion";

const Home = () => {
  const [text, setText] = useState("");
  const imageRef = useRef(null);

  // ✅ Tour state
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      target: '[data-tour="text-input"]',
      content: "Type your name here. It will appear on the image.",
      placement: "top",
      spotlightPadding: 8,
    },
    {
      target: '[data-tour="download-btn"]',
      content: "Click here to download the final image with your text.",
      placement: "top",
      spotlightPadding: 8,
    },
  ];

  // Auto-start once when page loads (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStepIndex(0);
      setRunTour(true);
    }, 1000); // 300–800ms is ideal

    return () => clearTimeout(timer);
  }, []);

  const handleJoyride = (data) => {
    const { status, index, action, type } = data;

    // End tour
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      setStepIndex(0);
      return;
    }

    // Keep stepIndex in sync so Next/Back works
    if (type === "step:after") {
      setStepIndex(action === "prev" ? index - 1 : index + 1);
    }
  };

  const downloadImage = async () => {
    if (imageRef.current) {
      // Ensure fonts are loaded (helps custom font rendering)
      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await html2canvas(imageRef.current, {
        backgroundColor: null,
        useCORS: true,
      });

      const dataUrl = canvas.toDataURL("image/png");

      const safeName =
        (text || "oqbi-design")
          .trim()
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
          .slice(0, 40) || "oqbi-design";

      const link = document.createElement("a");
      link.download = `${safeName}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <>
      {/* ✅ Tour */}
      <Joyride
        steps={steps}
        run={runTour}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        scrollToFirstStep
        disableBeacon:true
        callback={handleJoyride}
        styles={{ options: { zIndex: 9999 } }}
      />

      <AnimatePresence>
        <motion.section
          className="min-h-screen w-full px-12 py-6 flex flex-col"
          {...slideAnimation("left")}
        >
          <motion.header className="mb-6" {...slideAnimation("down")}>
            <img
              src="./oqbi.png"
              alt="logo"
              className="h-12 w-auto object-contain"
            />
          </motion.header>

          <div className="mx-auto flex items-center justify-center">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 lg:px-16 xl:px-24 w-full"
              {...headContainerAnimation}
            >
              <motion.div
                className="flex flex-col items-center gap-4 py-12"
                {...headTextAnimation}
              >
                <img
                  src="./ramdhan1.png"
                  alt=""
                  className="w-[80vh] h-[70vh] object-contain"
                />
              </motion.div>

              <motion.div
                className="relative w-fit mx-auto"
                {...headContentAnimation}
                ref={imageRef}
              >
                <img
                  src="./Main.png"
                  alt="logo"
                  className="h-[80vh] w-auto object-contain"
                />

                {/* ✅ Step 1 target */}
                <input
                  data-tour="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text…"
                  className="absolute bottom-4 font-myfont left-1/2 -translate-x-1/2 bg-black/50 text-white text-2xl px-4 py-2 rounded-lg backdrop-blur-sm outline-none text-center max-w-[90%]"
                  style={{ width: `${Math.max(text.length, 20)}ch` }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ✅ Step 2 target */}
          <button
            data-tour="download-btn"
            className="my-2 flex items-center justify-center"
            onClick={downloadImage}
          >
            <img src="./download.png" className="h-[80px] w-[80px]" alt="" />
          </button>
        </motion.section>
      </AnimatePresence>
    </>
  );
};

export default Home;
