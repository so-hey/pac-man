import * as tf from "@tensorflow/tfjs";
import * as tfd from "@tensorflow/tfjs-data";
import { Dispatch } from "react";

const NUM_CLASSES = 4;

// TODO: add type of webcam
let webcam: any;

class ControllerDataset {
  numClasses: number;
  exampleCount: number[];
  xs: tf.Tensor | undefined;
  ys: tf.Tensor | undefined;

  constructor(numClasses: number) {
    this.numClasses = numClasses;
    this.exampleCount = Array(numClasses).fill(0);
  }

  addExample(example: tf.Tensor, label: number) {
    this.exampleCount[label]++;

    const y = tf.tidy(() =>
      tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses)
    );

    if (this.xs === undefined || this.ys === undefined) {
      this.xs = tf.keep(example);
      this.ys = tf.keep(y);
    } else {
      const oldX = this.xs;
      this.xs = tf.keep(oldX.concat(example, 0));

      const oldY = this.ys;
      this.ys = tf.keep(oldY.concat(y, 0));

      oldX.dispose();
      oldY.dispose();
      y.dispose();
    }
    return this.exampleCount[label];
  }
}

const controllerDataset = new ControllerDataset(NUM_CLASSES);

let truncatedMobileNet: tf.LayersModel;
let model: tf.Sequential;

async function loadTruncatedMobileNet() {
  const mobilenet = await tf.loadLayersModel(
    "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
  );

  const layer = mobilenet.getLayer("conv_pw_13_relu");
  return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
}

async function train(
  setLoss: Dispatch<React.SetStateAction<number | null>>,
  units: number = 100,
  learningRate: number = 0.0001,
  batchSizeFraction: number = 0.4,
  epochs: number = 20
) {
  if (controllerDataset.xs == null) {
    throw new Error("Add some examples before training!");
  }
  model = tf.sequential({
    layers: [
      tf.layers.flatten({
        inputShape: truncatedMobileNet.outputs[0].shape.slice(1),
      }),
      tf.layers.dense({
        units,
        activation: "relu",
        kernelInitializer: "varianceScaling",
        useBias: true,
      }),
      tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: "varianceScaling",
        useBias: false,
        activation: "softmax",
      }),
    ],
  });

  const optimizer = tf.train.adam(learningRate);

  model.compile({ optimizer: optimizer, loss: "categoricalCrossentropy" });

  const batchSize = Math.floor(
    controllerDataset.xs.shape[0] * batchSizeFraction
  );
  if (!(batchSize > 0)) {
    throw new Error(
      `Batch size is 0 or NaN. Please choose a non-zero fraction.`
    );
  }

  model.fit(controllerDataset.xs, controllerDataset.ys as tf.Tensor, {
    batchSize,
    epochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        setLoss(logs?.loss as number);
      },
    },
  });
}

let isPredicting = true;

async function predict() {
  while (isPredicting) {
    const img = await getImage();

    const embeddings = truncatedMobileNet.predict(img);

    const predictions = model.predict(embeddings);

    if (Array.isArray(predictions)) {
      throw new Error("Predictions is not an array");
    }

    const predictedClass = predictions.as1D().argMax();
    const classId = (await predictedClass.data())[0];
    img.dispose();

    await tf.nextFrame();
    return classId;
  }
}

async function getImage() {
  if (!webcam) {
    return;
  }
  const img = await webcam.capture();
  const processedImg = tf.tidy(() =>
    img.expandDims(0).toFloat().div(127).sub(1)
  );
  img.dispose();
  return processedImg;
}

async function init() {
  try {
    webcam = await tfd.webcam(
      document.getElementById("webcam") as HTMLVideoElement
    );
    const dummyCam = await tfd.webcam(
      document.getElementById("webcamDummy") as HTMLVideoElement
    );
    await dummyCam.capture();
  } catch (e) {
    console.log(e);
    return;
  }
  truncatedMobileNet = await loadTruncatedMobileNet();

  const screenShot = await webcam.capture();
  truncatedMobileNet.predict(screenShot.expandDims(0));
  screenShot.dispose();
}

export {
  controllerDataset,
  truncatedMobileNet,
  train,
  predict,
  getImage,
  init,
};
