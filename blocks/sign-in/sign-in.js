export default function decorate(block) {
  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'sign-in-form';
  form.setAttribute('novalidate', '');

  const heading = document.createElement('h2');
  heading.textContent = 'Sign In';
  form.append(heading);

  const errorMsg = document.createElement('div');
  errorMsg.className = 'sign-in-error';
  errorMsg.setAttribute('role', 'alert');
  errorMsg.hidden = true;
  form.append(errorMsg);

  // Email field
  const emailGroup = document.createElement('div');
  emailGroup.className = 'sign-in-field';
  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'sign-in-email');
  emailLabel.textContent = 'Email';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'sign-in-email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Enter your email';
  emailInput.required = true;
  emailInput.setAttribute('autocomplete', 'email');
  emailGroup.append(emailLabel, emailInput);

  // Password field
  const pwGroup = document.createElement('div');
  pwGroup.className = 'sign-in-field';
  const pwLabel = document.createElement('label');
  pwLabel.setAttribute('for', 'sign-in-password');
  pwLabel.textContent = 'Password';
  const pwInput = document.createElement('input');
  pwInput.type = 'password';
  pwInput.id = 'sign-in-password';
  pwInput.name = 'password';
  pwInput.placeholder = 'Enter your password';
  pwInput.required = true;
  pwInput.setAttribute('autocomplete', 'current-password');
  pwGroup.append(pwLabel, pwInput);

  // Options row
  const optionsRow = document.createElement('div');
  optionsRow.className = 'sign-in-options';

  const rememberLabel = document.createElement('label');
  rememberLabel.className = 'sign-in-remember';
  const rememberCheckbox = document.createElement('input');
  rememberCheckbox.type = 'checkbox';
  rememberCheckbox.name = 'remember';
  const rememberText = document.createTextNode(' Remember me');
  rememberLabel.append(rememberCheckbox, rememberText);

  const forgotLink = document.createElement('a');
  forgotLink.href = '#';
  forgotLink.className = 'sign-in-forgot';
  forgotLink.textContent = 'Forgot password?';

  optionsRow.append(rememberLabel, forgotLink);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'button primary sign-in-submit';
  submitBtn.textContent = 'Sign In';

  form.append(emailGroup, pwGroup, optionsRow, submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = pwInput.value.trim();

    if (!email || !password) {
      errorMsg.textContent = 'Please fill in all fields.';
      errorMsg.hidden = false;
      return;
    }

    if (!emailInput.validity.valid) {
      errorMsg.textContent = 'Please enter a valid email address.';
      errorMsg.hidden = false;
      return;
    }

    errorMsg.hidden = true;
    // Demo: show success
    // eslint-disable-next-line no-alert
    alert(`Sign in attempted with: ${email}`);
  });

  block.append(form);
}
