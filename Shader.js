class Shader {
    constructor(vertShaderId, fragShaderId) {
        this.shaderProgram = gl.createProgram();
        
        // Compilação com tratamento de erro
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertShaderId);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragShaderId);

        if (!vertexShader || !fragmentShader) {
            throw new Error("Shader compilation failed");
        }

        // BASEADO NO ORIGINAL: Anexar e linkar shaders
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);

        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(this.shaderProgram);
            gl.deleteProgram(this.shaderProgram);
            throw new Error("Shader program linking failed: " + error);
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    // AUTORAL: Organização melhorada
    compileShader(type, scriptId) {
        const shaderScript = document.getElementById(scriptId);
        if (!shaderScript) {
            throw new Error(`Shader script not found: ${scriptId}`);
        }

        // AUTORAL: Leitura direta do conteúdo embedado
        const shaderSource = shaderScript.text.trim();
        
        const shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        // AUTORAL: Log do código com erro
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error("Shader source with error:\n", shaderSource);
            gl.deleteShader(shader);
            throw new Error(`Shader compile error (${scriptId}): ${error}`);
        }

        return shader;
    }

    UseProgram() {
        gl.useProgram(this.shaderProgram);
    }

    GetProgram() {
        return this.shaderProgram;
    }

    // Autoral: Verificação de location nula
    SetUniformVec2(uniformName, vector) {
        const loc = gl.getUniformLocation(this.shaderProgram, uniformName);
        if (loc !== null) gl.uniform2fv(loc, vector);
    }

    SetUniform1f(uniformName, value) {
        const loc = gl.getUniformLocation(this.shaderProgram, uniformName);
        if (loc !== null) gl.uniform1f(loc, value);
    }
}