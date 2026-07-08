'use strict';

(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const formStatus = document.getElementById('formStatus');

  const CONTACT_EMAIL = 'contact@miwako-aoki.com';
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ============ エラー表示ヘルパー ============ */
  const getFormField = (input) => input?.closest('.form-field') || null;

  const setFieldError = (input) => {
    const field = getFormField(input);
    if (field) field.classList.add('has-error');
  };

  const clearFieldError = (input) => {
    const field = getFormField(input);
    if (field) field.classList.remove('has-error');
  };

  const showStatus = (message, type) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove('is-error', 'is-success');
    formStatus.classList.add(type === 'success' ? 'is-success' : 'is-error');
  };

  const clearStatus = () => {
    if (!formStatus) return;
    formStatus.textContent = '';
    formStatus.classList.remove('is-error', 'is-success');
  };

  /* ============ 入力時にエラー解除 ============ */
  [nameField, emailField, messageField].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      clearFieldError(input);
      clearStatus();
    });
  });

  /* ============ バリデーション ============ */
  const validate = () => {
    const name = nameField?.value.trim() || '';
    const email = emailField?.value.trim() || '';
    const message = messageField?.value.trim() || '';

    if (!name) {
      setFieldError(nameField);
      showStatus('お名前を入力してください', 'error');
      nameField?.focus();
      return null;
    }
    clearFieldError(nameField);

    if (!email) {
      setFieldError(emailField);
      showStatus('メールアドレスを入力してください', 'error');
      emailField?.focus();
      return null;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setFieldError(emailField);
      showStatus('メールアドレスの形式が正しくありません', 'error');
      emailField?.focus();
      return null;
    }
    clearFieldError(emailField);

    if (!message) {
      setFieldError(messageField);
      showStatus('お問い合わせ内容を入力してください', 'error');
      messageField?.focus();
      return null;
    }
    clearFieldError(messageField);

    return { name, email, message };
  };

  /* ============ mailtoリンク生成 ============ */
  const buildMailtoLink = ({ name, email, message }) => {
    const subject = `HPよりお問い合わせ（${name}様）`;
    const body = [
      `お名前：${name}`,
      `メールアドレス：${email}`,
      '',
      'お問い合わせ内容：',
      message,
    ].join('\n');

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  /* ============ 送信処理 ============ */
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = validate();
    if (!data) return;

    window.location.href = buildMailtoLink(data);

    showStatus(
      `メールソフトが起動します。送信できない場合は ${CONTACT_EMAIL} へ直接ご連絡ください。`,
      'success'
    );
  });
})();
