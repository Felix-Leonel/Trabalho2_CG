var mesh, timer, shaderProgram;
var canvas, gl;
var animationFrameId;

var start = function() {
    console.log("Iniciando aplicação...");
    if (!initCanvas()) {
        console.error("WebGL initialization failed");
        return;
    }

    try {
        timer = new Timer();
        shaderProgram = new Shader('vertShader', 'fragShader');
        shaderProgram.UseProgram();

        var vertices = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0];
        var indices = [2, 0, 1, 1, 0, 3];
        
        mesh = new Mesh(vertices, indices, shaderProgram);
        
        drawScene();
    } catch (error) {
        console.error("Runtime error:", error);
    }
};

var initCanvas = function() {
    try {
        canvas = document.getElementById('game-surface');
        if (!canvas) {
            throw new Error("Canvas element not found");
        }

        gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (!gl) {
            canvas.style.backgroundColor = '#000';
            canvas.style.color = '#fff';
            canvas.style.display = 'flex';
            canvas.style.alignItems = 'center';
            canvas.style.justifyContent = 'center';
            canvas.innerHTML = '<p>Seu navegador não suporta WebGL. Por favor atualize ou use Chrome/Firefox.</p>';
            throw new Error("WebGL não suportado. Tente usar Chrome ou Firefox.");
        }

        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        return true;
    } catch (error) {
        console.error("Canvas initialization error:", error);
        return false;
    }
};

function drawScene() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    timer.Update();
    
    if (shaderProgram) {
        shaderProgram.SetUniformVec2("resolution", [gl.canvas.width, gl.canvas.height]);
        shaderProgram.SetUniform1f("time", timer.elapsedTime);
    }

    if (mesh) {
        console.log("Desenhando malha..."); // Verifique se esta mensagem aparece
        mesh.Draw();
    }

    animationFrameId = requestAnimationFrame(drawScene);
}

function resize(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.round(canvas.clientWidth * dpr);
    const displayHeight = Math.round(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        console.log("Canvas redimensionado para:", canvas.width, "x", canvas.height);
    }
}

window.addEventListener('beforeunload', function() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});

window.onload = start;