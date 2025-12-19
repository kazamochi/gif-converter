import { pipeline, env } from '@xenova/transformers';

// Skip local model check (use remote from Hugging Face for now)
env.allowLocalModels = false;
env.useBrowserCache = true;

class AIWorker {
    private static instance: AIWorker;
    private pipelines: Map<string, any> = new Map();

    private constructor() {
        self.onmessage = this.handleMessage.bind(this);
    }

    public static getInstance(): AIWorker {
        if (!AIWorker.instance) {
            AIWorker.instance = new AIWorker();
        }
        return AIWorker.instance;
    }

    private async handleMessage(event: MessageEvent) {
        const { type, payload, id } = event.data;

        try {
            switch (type) {
                case 'INIT_PIPELINE':
                    await this.initPipeline(payload.task, payload.model, id);
                    break;
                case 'PROCESS':
                    await this.process(payload.task, payload.input, id);
                    break;
                default:
                    throw new Error(`Unknown message type: ${type}`);
            }
        } catch (error: any) {
            self.postMessage({ type: 'ERROR', payload: error.message, id });
        }
    }

    private async initPipeline(task: string, model: string, id: string) {
        const key = `${task}:${model}`;
        if (!this.pipelines.has(key)) {
            self.postMessage({ type: 'STATUS', payload: `Loading model: ${model}...`, id });

            const pipe = await pipeline(task as any, model, {
                progress_callback: (progress: any) => {
                    self.postMessage({ type: 'PROGRESS', payload: progress, id });
                }
            });

            this.pipelines.set(key, pipe);
        }
        self.postMessage({ type: 'READY', payload: key, id });
    }

    private async process(key: string, input: any, id: string) {
        const pipe = this.pipelines.get(key);
        if (!pipe) throw new Error(`Pipeline ${key} not initialized`);

        self.postMessage({ type: 'STATUS', payload: 'Processing...', id });
        const output = await pipe(input);
        self.postMessage({ type: 'RESULT', payload: output, id });
    }
}

// Initialize the worker
AIWorker.getInstance();
