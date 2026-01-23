// ==UserScript==
// @name         工具:常用函数集合
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  常用工具函数，注册到 window.common，供其他脚本通用
// @author       forhope_du
// @match        https://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log(Date.now() + ' 常用函数集合脚本加载ing');

    // 弹窗提示（支持多个toast不重叠，变量私有化）
    const showToast = (() => {
        const activeToasts = [];
        const TOAST_GAP = 10;
        const TOAST_HEIGHT = 40;
        return function(message, duration = 3000) {
            const top = 50 + activeToasts.length * (TOAST_HEIGHT + TOAST_GAP);
            let toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: ${top}px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                opacity: 0;
                transition: opacity 0.3s ease, top 0.3s;
            `;
            document.body.appendChild(toast);
            activeToasts.push(toast);
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                    const idx = activeToasts.indexOf(toast);
                    if (idx > -1) {
                        activeToasts.splice(idx, 1);
                        // 重新排列剩余toast
                        for (let i = idx; i < activeToasts.length; i++) {
                            activeToasts[i].style.top = (50 + i * (TOAST_HEIGHT + TOAST_GAP)) + 'px';
                        }
                    }
                }, 300);
            }, duration);
        };
    })();

        // 通用日志函数
    function log(msg) {
        const logs = JSON.parse(localStorage.getItem('upload_logs') || '[]');
        logs.unshift({ time: new Date().toLocaleString(), msg });
        const logsStr = JSON.stringify(logs);
        if (logsStr.length > 1024 * 1024) {
            const msg = '日志已超过1MB，请及时导出或清理！';
            if (!showToast) {
                alert(msg);
            } else {
                showToast('日志已超过1MB，请及时导出或清理！', 5000);
            }
        }
        localStorage.setItem('upload_logs', logsStr);
        console.log('[批量上传]', msg);
    }

    // 通用日志按钮容器生成函数
    function createLogButtonGroup() {
        const container = document.createElement('div');
        container.id = 'tm-log-btn-group';
        container.style = 'display:flex;flex-direction:column;gap:10px;';

        // 查看日志按钮
        const viewBtn = document.createElement('button');
        viewBtn.id = 'tm-log-btn';
        viewBtn.textContent = '查看日志';
        viewBtn.style = 'padding:8px 16px;background:#67c23a;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        container.appendChild(viewBtn);

        // 导出日志按钮
        const exportBtn = document.createElement('button');
        exportBtn.id = 'tm-export-btn';
        exportBtn.textContent = '导出日志';
        exportBtn.style = 'padding:8px 16px;background:#409eff;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        container.appendChild(exportBtn);

        // 清除日志按钮
        const clearBtn = document.createElement('button');
        clearBtn.id = 'tm-clear-btn';
        clearBtn.textContent = '清除日志';
        clearBtn.style = 'padding:8px 16px;background:#f56c6c;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        container.appendChild(clearBtn);

        // 查看日志功能
        viewBtn.onclick = () => {
            const logs = JSON.parse(localStorage.getItem('upload_logs') || '[]');
            let logWindow = window.open('', '_blank', 'width=600,height=400,scrollbars=yes');
            logWindow.document.write('<html><head><title>上传日志</title></head><body><h2>上传日志</h2><pre style="white-space:pre-wrap;">' +
                logs.map(entry => `[${entry.time}] ${entry.msg}`).join('\n') +
                '</pre></body></html>');
        };

        // 导出日志功能
        exportBtn.onclick = () => {
            const logs = localStorage.getItem('upload_logs') || '[]';
            const blob = new Blob([logs], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'upload_logs.json';
            a.click();
            URL.revokeObjectURL(url);
        };

        // 清除日志功能
        clearBtn.onclick = () => {
            localStorage.removeItem('upload_logs');
            showToast('日志已清除');
        };

        return container;
    }

    // 添加按钮到页面
    function addButton({ id, text, onClick, style = '', parent = document.body }) {
        if (document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        btn.style = style || 'position:fixed;top:100px;right:40px;z-index:9999;padding:8px 16px;background:#409eff;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        btn.addEventListener('click', onClick);
        parent.appendChild(btn);
        return btn;
    }

    // 使元素可拖动
    function makeDraggable(wrapperEl, handleEl) {
        let dragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        handleEl.style.cursor = 'move';

        handleEl.addEventListener('mousedown', (e) => {
            dragging = true;
            const rect = wrapperEl.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;

            wrapperEl.style.left = `${rect.left}px`;
            wrapperEl.style.top = `${rect.top}px`;
            wrapperEl.style.right = 'auto';
            wrapperEl.style.bottom = 'auto';
            wrapperEl.style.transform = 'none';
            wrapperEl.style.position = 'fixed';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            wrapperEl.style.left = `${startLeft + dx}px`;
            wrapperEl.style.top = `${startTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
        });
    }

    // 绑定复制按钮
    function bindCopy(btn, getText, msg = '已复制') {
        if (!btn) return;
        btn.addEventListener('mousedown', (e) => e.stopPropagation());
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const text = typeof getText === 'function' ? String(getText() ?? '') : '';
            if (!text.trim()) return showToast('无可复制内容');
            try {
                await navigator.clipboard.writeText(text);
            } catch {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            showToast(msg);
        });
    }

    // 审核/请求类通用fetch
    async function request(url, data = {}, method = 'GET', isJson = true) {
        method = method.toUpperCase();
        const headers = {};
        if (method === 'POST') {
            headers['Content-Type'] = isJson
                ? 'application/json'
                : 'application/x-www-form-urlencoded; charset=UTF-8';
            headers['X-Requested-With'] = 'XMLHttpRequest';
            headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        }
        let fetchUrl = url;
        let body = null;
        if (method === 'GET') {
            const query = new URLSearchParams(data).toString();
            fetchUrl += query ? `?${query}` : '';
        } else {
            body = isJson ? JSON.stringify(data) : new URLSearchParams(data).toString();
        }
        const response = await fetch(fetchUrl, {
            method,
            headers,
            body,
            credentials: 'include',
        });
        const rawText = await response.text().catch(() => '');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText} ${rawText}`);
        }
        try {
            return rawText ? JSON.parse(rawText) : {};
        } catch (e) {
            throw new Error(`Non-JSON response: ${rawText.slice(0, 180)}`);
        }
    }

    // 导出到 window.customUtils
    window.customUtils = {
        showToast,
        log,
        createLogButtonGroup, 
        addButton,
        makeDraggable,
        bindCopy,
        request,
    };

    console.log(Date.now() + ' 常用函数集合脚本加载完成！');
})();