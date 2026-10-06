package com.nhom8.freelance.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.awt.Desktop;
import java.io.File;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;

@Component
@Slf4j
public class FrontendLauncher {

    @Value("${app.dev.auto-start-frontend:true}")
    private boolean autoStartFrontend;

    @Value("${server.port:8080}")
    private int backendPort;

    private static Process frontendProcess = null;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        if (!autoStartFrontend) {
            log.info("Auto-start frontend is disabled in current profile.");
            return;
        }

        printBanner();

        // 1. Check if frontend is already running on port 3000
        boolean frontendRunning = isPortInUse("localhost", 3000);

        if (!frontendRunning) {
            File frontendDir = findFrontendDirectory();
            if (frontendDir != null && frontendDir.exists()) {
                log.info("Starting Frontend (React Vite) automatically from: {}", frontendDir.getAbsolutePath());
                startFrontendProcess(frontendDir);
            } else {
                log.warn("Frontend directory could not be located. Please run 'npm run dev' manually in the frontend directory.");
            }
        } else {
            log.info("Frontend is already running on http://localhost:3000");
        }

        // 2. Open browser automatically
        openBrowser("http://localhost:3000");
    }

    private File findFrontendDirectory() {
        // Try current dir / frontend
        File dir1 = new File("frontend");
        if (new File(dir1, "package.json").exists()) {
            return dir1;
        }

        // Try parent dir / frontend
        File dir2 = new File("../frontend");
        if (new File(dir2, "package.json").exists()) {
            return dir2;
        }

        // Try absolute path if working directory is backend
        File currentDir = new File(".").getAbsoluteFile();
        if (currentDir.getName().equals("backend")) {
            File siblingFrontend = new File(currentDir.getParentFile(), "frontend");
            if (new File(siblingFrontend, "package.json").exists()) {
                return siblingFrontend;
            }
        }

        return null;
    }

    private void startFrontendProcess(File frontendDir) {
        new Thread(() -> {
            try {
                boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
                ProcessBuilder pb;

                if (isWindows) {
                    pb = new ProcessBuilder("cmd.exe", "/c", "npm.cmd", "run", "dev");
                } else {
                    pb = new ProcessBuilder("npm", "run", "dev");
                }

                pb.directory(frontendDir);
                pb.inheritIO(); // Streams logs to console
                frontendProcess = pb.start();

                // Shutdown hook to clean up node process when backend stops
                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    if (frontendProcess != null && frontendProcess.isAlive()) {
                        log.info("Stopping frontend background process...");
                        try {
                            frontendProcess.descendants().forEach(ProcessHandle::destroyForcibly);
                            frontendProcess.destroyForcibly();
                        } catch (Exception ignored) {
                        }
                    }
                }));

                frontendProcess.waitFor();
            } catch (Exception e) {
                log.error("Failed to start frontend process: {}", e.getMessage());
            }
        }, "frontend-launcher-thread").start();
    }

    private boolean isPortInUse(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 600);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void openBrowser(String url) {
        new Thread(() -> {
            try {
                // Short wait to ensure Vite dev server is serving requests
                Thread.sleep(1800);

                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(new URI(url));
                    log.info("Successfully opened browser at: {}", url);
                } else {
                    boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
                    if (isWindows) {
                        Runtime.getRuntime().exec(new String[]{"rundll32", "url.dll,FileProtocolHandler", url});
                        log.info("Successfully launched Windows default browser at: {}", url);
                    }
                }
            } catch (Exception e) {
                log.info("Could not auto-open browser directly ({}), please visit: {}", e.getMessage(), url);
            }
        }, "browser-opener-thread").start();
    }

    private void printBanner() {
        System.out.println("\n" +
                "========================================================================\n" +
                "  🚀 FREELANCEHUB - CHUYÊN ĐỀ TỐT NGHIỆP 2 (NHÓM 8 - ĐH VĂN LANG)        \n" +
                "========================================================================\n" +
                "  🌐 Ứng dụng Web Frontend:    http://localhost:3000                    \n" +
                "  🔌 Backend REST API:         http://localhost:" + backendPort + "/api/v1           \n" +
                "  📖 Swagger UI Tài liệu API:  http://localhost:" + backendPort + "/api/v1/swagger-ui.html \n" +
                "  🗄️ H2 Database Console:      http://localhost:" + backendPort + "/api/v1/h2-console  \n" +
                "                                                                        \n" +
                "  🔑 TÀI KHOẢN MẪU (Mật khẩu chung: Password123@):                      \n" +
                "   - Quản trị viên: admin@freelancehub.vn                               \n" +
                "   - Nhà tuyển dụng: recruiter@thecoffee.vn, techlead@innovate.vn       \n" +
                "   - Sinh viên:      sinhvien.khoi@vanlanguni.vn, sinhvien.tai@vanlanguni.vn\n" +
                "========================================================================\n");
    }
}
