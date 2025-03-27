class Timer {
    constructor() {
        //performance.now() para maior precisão
        this.startTime = performance.now();
        this.elapsedTime = 0;
    }

    //Lógica simplificada de atualização
    Update() {
        this.elapsedTime = (performance.now() - this.startTime) * 0.001; // Converter para segundos
    }
}