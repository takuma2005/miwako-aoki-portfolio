'use strict';

(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const formStatus = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');

  // FormspreeのフォームIDだけを公開し、受信先は管理画面で設定する。
  const endpoint = form.getAttribute('action') || '';
  const isConfigured = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint);
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const UNAVAILABLE_MESSAGE = '現在フォームの受付を準備中です。Instagramからご連絡ください。';

  /* ============ エラー表示ヘルパー ============ */
  const getFormField = (input) => input?.closest('.form-field') || null;

  const setFieldError = (input) => {
    const field = getFormField(input);
    if (field) field.classList.add('has-error');
    input?.setAttribute('aria-invalid', 'true');
    input?.setAttribute('aria-describedby', 'formStatus');
  };

  const clearFieldError = (input) => {
    const field = getFormField(input);
    if (field) field.classList.remove('has-error');
    input?.removeAttribute('aria-invalid');
    input?.removeAttribute('aria-describedby');
  };

  const showStatus = (message) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.add('is-error');
  };

  const clearStatus = () => {
    if (!formStatus) return;
    formStatus.textContent = '';
    formStatus.classList.remove('is-error');
  };

  /* ============ 入力時にエラー解除 ============ */
  [nameField, emailField, messageField].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      clearFieldError(input);
      if (isConfigured) clearStatus();
    });
  });

  /* ============ バリデーション ============ */
  const validate = () => {
    const name = nameField?.value.trim() || '';
    const email = emailField?.value.trim() || '';
    const message = messageField?.value.trim() || '';

    if (!name) {
      setFieldError(nameField);
      showStatus('お名前を入力してください');
      nameField?.focus();
      return null;
    }
    clearFieldError(nameField);

    if (!email) {
      setFieldError(emailField);
      showStatus('メールアドレスを入力してください');
      emailField?.focus();
      return null;
    }

    if (!EMAIL_PATTERN.test(email) || emailField.validity.typeMismatch) {
      setFieldError(emailField);
      showStatus('メールアドレスの形式が正しくありません');
      emailField?.focus();
      return null;
    }
    clearFieldError(emailField);

    if (!message) {
      setFieldError(messageField);
      showStatus('お問い合わせ内容を入力してください');
      messageField?.focus();
      return null;
    }
    clearFieldError(messageField);

    return { name, email, message };
  };

  /* ============ 送信処理 ============ */
  form.noValidate = true;
  submitButton.disabled = !isConfigured;
  if (!isConfigured) showStatus(UNAVAILABLE_MESSAGE);

  form.addEventListener('submit', (event) => {
    if (!isConfigured) {
      event.preventDefault();
      showStatus(UNAVAILABLE_MESSAGE);
      return;
    }

    const data = validate();
    if (!data) {
      event.preventDefault();
      return;
    }

    nameField.value = data.name;
    emailField.value = data.email;
    messageField.value = data.message;
    clearStatus();
    // 通常のPOSTでFormspreeへ送信し、迷惑送信対策と受付完了画面は同サービスで表示。
    // ここでは送信成功を表示せず、戻った際に再編集できるよう入力内容を保持する。
  });
})();
