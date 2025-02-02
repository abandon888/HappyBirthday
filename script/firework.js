        const canvas = document.getElementById('fireworksCanvas');
        const ctx = canvas.getContext('2d');
        let fireworks = [];

        // 设置画布尺寸
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // 粒子类
        class Particle {
            constructor(x, y, color, angle, speed) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.angle = angle;
                this.speed = speed;
                this.size = Math.random() * 2 + 1; // 粒子大小
                this.alpha = 1; // 透明度
                this.gravity = 0.02; // 重力
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.speed *= 0.98; // 速度衰减
                this.alpha -= 0.015; // 逐渐消失
                this.speed -= this.gravity; // 应用重力
            }

            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // 烟花类
        class Firework {
            constructor(x, y, particleCount = 50) {
                this.x = x;
                this.y = y;
                this.particles = [];
                this.colors = ["#ff5733", "#ffbd33", "#33ff57", "#3357ff", "#f033ff"];

                for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * Math.PI * 2; // 随机角度
                    const speed = Math.random() * 3 + 2; // 随机速度
                    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                    this.particles.push(new Particle(this.x, this.y, color, angle, speed));
                }
            }

            update() {
                this.particles.forEach((p, index) => {
                    p.update();
                    // 移除透明度为0的粒子
                    if (p.alpha <= 0) {
                        this.particles.splice(index, 1);
                    }
                });
            }

            draw() {
                this.particles.forEach(p => p.draw());
            }
        }

        // 动画循环
        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布内容
            ctx.fillStyle = "#fff"; // 轻微残影效果
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            fireworks.forEach((firework, index) => {
                firework.update();
                firework.draw();
                // 移除没有粒子的烟花
                if (firework.particles.length === 0) {
                    fireworks.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        // 监听点击事件
        document.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            fireworks.push(new Firework(x, y, 30)); // 30 表示粒子数量，可调整烟花大小
        });

        animate();