class Timer {
    constructor() {
        this.startTime = performance.now();
        this.elapsedTime = 0;
    }

    Update() {
        this.elapsedTime = (performance.now() - this.startTime) * 0.001; // Converter para segundos
    }
}