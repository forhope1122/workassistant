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

    // 弹窗提示
    function showToast(message, duration = 3000) {
        let toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50px;
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
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
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
        addButton,
        makeDraggable,
        bindCopy,
        request,
    };

    console.log(Date.now() + ' 常用函数集合脚本加载完成！');
})();