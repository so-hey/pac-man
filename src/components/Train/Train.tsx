import { useRef, useState, useEffect } from "react";
import {
  controllerDataset,
  truncatedMobileNet,
  train,
  predict,
  getImage,
  init,
} from "../../services/model";
import styles from "./Train.module.css";

interface TrainProps {
  back: () => void;
}

export default function Train({ back }: TrainProps) {
  const [loss, setLoss] = useState<number | null>(null);
  const [sampleCountUp, setSampleCountUp] = useState(0);
  const [sampleCountDown, setSampleCountDown] = useState(0);
  const [sampleCountLeft, setSampleCountLeft] = useState(0);
  const [sampleCountRight, setSampleCountRight] = useState(0);
  const [isTrained, setIsTrained] = useState(false);
  const [prediction, setPrediction] = useState(-1);

  const webcamRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async () => {
      await init();
    })();
  }, []);

  useEffect(() => {
    if (!isTrained) return;
    const interval = setInterval(async () => {
      const prediction = await predict();
      setPrediction(prediction as number);
    }, 50);
    return () => clearInterval(interval);
  }, [isTrained]);

  return (
    <div>
      <div onClick={back} className={styles.back}>
        <p className={styles.backText}>Back</p>
      </div>

      <div className={styles.field}>
        <div></div>
        <div
          className={styles.box}
          onClick={async () => {
            const img = await getImage();
            controllerDataset.addExample(truncatedMobileNet.predict(img), 0);
            setSampleCountUp(sampleCountUp + 1);
          }}
          style={{
            border: prediction === 0 ? "1px solid green" : "1px solid white",
          }}
        >
          UP
          <p>{sampleCountUp}</p>
        </div>
        <div></div>
        <div
          className={styles.box}
          onClick={async () => {
            const img = await getImage();
            controllerDataset.addExample(truncatedMobileNet.predict(img), 2);
            setSampleCountLeft(sampleCountLeft + 1);
          }}
          style={{
            border: prediction === 2 ? "1px solid green" : "1px solid white",
          }}
        >
          LEFT
          <p>{sampleCountLeft}</p>
        </div>

        <video
          ref={webcamRef}
          id="webcam"
          autoPlay
          playsInline
          muted
          height={224}
          width={224}
          style={{
            width: "112px",
            height: "112px",
            WebkitTransform: "scaleX(-1)",
          }}
        />
        <div
          className={styles.box}
          onClick={async () => {
            const img = await getImage();
            controllerDataset.addExample(truncatedMobileNet.predict(img), 3);
            setSampleCountRight(sampleCountRight + 1);
          }}
          style={{
            border: prediction === 3 ? "1px solid green" : "1px solid white",
          }}
        >
          RIGHT
          <p>{sampleCountRight}</p>
        </div>
        <div className={styles.box}>OPTION</div>
        <div
          className={styles.box}
          onClick={async () => {
            const img = await getImage();
            controllerDataset.addExample(truncatedMobileNet.predict(img), 1);
            setSampleCountDown(sampleCountDown + 1);
          }}
          style={{
            border: prediction === 1 ? "1px solid green" : "1px solid white",
          }}
        >
          DOWN <p>{sampleCountDown}</p>
        </div>
        <div
          className={styles.box}
          onClick={() => {
            train(setLoss);
            setIsTrained(true);
          }}
          style={{ border: "1px solid red" }}
        >
          TRAIN
          {loss && (
            <>
              <p style={{ fontSize: "13px" }}>loss:</p>
              <span style={{ fontSize: "12px" }}>{loss?.toFixed(5)}</span>
            </>
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
}
