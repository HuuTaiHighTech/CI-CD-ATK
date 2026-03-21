const generatePassword = (
   minLength = 8,
   maxLength = 16,
   options = {}
): string => {
   const defaults = {
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeChars: ''
   };

   const config = { ...defaults, ...options };

   const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   const lowercase = 'abcdefghijklmnopqrstuvwxyz';
   const numbers = '0123456789';
   const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

   let charset = '';
   let requiredChars = [];

   if (config.includeUppercase) {
      charset += uppercase;
      requiredChars.push(uppercase);
   }
   if (config.includeLowercase) {
      charset += lowercase;
      requiredChars.push(lowercase);
   }
   if (config.includeNumbers) {
      charset += numbers;
      requiredChars.push(numbers);
   }
   if (config.includeSymbols) {
      charset += symbols;
      requiredChars.push(symbols);
   }

   if (config.excludeChars) {
      charset = charset
         .split('')
         .filter((char) => !config.excludeChars.includes(char))
         .join('');
   }

   if (charset.length === 0) {
      throw new Error('Phải chọn ít nhất một loại ký tự!');
   }

   if (minLength < requiredChars.length) {
      throw new Error(`Độ dài tối thiểu phải là ${requiredChars.length}`);
   }

   if (minLength > maxLength) {
      throw new Error('minLength không được lớn hơn maxLength');
   }

   // Random length trong khoảng min-max
   const length =
      Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

   let password = '';

   // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
   requiredChars.forEach((charSet) => {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      password += charSet[randomIndex];
   });

   // Điền phần còn lại
   for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
   }

   // Xáo trộn
   password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

   return password;
};

export default generatePassword;
