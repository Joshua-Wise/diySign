document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const signatureForm = document.getElementById('signature-form');
  const signaturePreview = document.getElementById('signature-preview');
  const btnCopy = document.getElementById('btn-copy');
  const campusSelect = document.getElementById('campus');
  const organizationSpan = document.getElementById('organization');
  const addressSpan = document.getElementById('address');
  const phoneSpan = document.getElementById('phone');
  
  // Initialize with default values
  let currentSignatureHtml = '';
  let campusData = {};
  
  // Static values
  let organization = "CELINA INDEPENDENT SCHOOL DISTRICT";
  let address = "205 S. Colorado • Celina, TX 75009";
  let phone = "469-742-9100";
  let logoPath = "images/logos/district-logo.png"; // Default logo path
  const tagline = "COMMUNITY    EXCELLENCE    INNOVATION    LEADERSHIP    STEWARDSHIP";
  const fontFamily = "Arial, sans-serif";
  const primaryColor = "#F05A28"; // Orange color from the logo
  const taglineBgColor = "#746c6c"; // Updated tagline background color
  
  // Set CSS variables for the static values
  document.documentElement.style.setProperty('--primary-color', primaryColor);
  document.documentElement.style.setProperty('--font-family', fontFamily);
  
  // Load campus data from JSON file
  fetch('data/campuses.json')
    .then(response => response.json())
    .then(data => {
      campusData = data;
      
      // Populate campus dropdown
      populateCampusDropdown(data.campuses);
      
      // Set up campus change event
      campusSelect.addEventListener('change', updateCampusInfo);
      
      // Initialize with the first campus
      if (data.campuses.length > 0) {
        updateCampusInfo();
      }
    })
    .catch(error => console.error('Error loading campus data:', error));
  
  // Populate campus dropdown with options from JSON
  function populateCampusDropdown(campuses) {
    // Clear existing options
    campusSelect.innerHTML = '';
    
    // Add options for each campus
    campuses.forEach(campus => {
      const option = document.createElement('option');
      option.value = campus.id;
      option.textContent = campus.name;
      campusSelect.appendChild(option);
    });
  }
  
  // Update organization info based on selected campus
  function updateCampusInfo() {
    const selectedCampus = campusSelect.value;
    const campus = campusData.campuses.find(c => c.id === selectedCampus);
    
    if (campus) {
      organization = campus.organization;
      address = campus.address;
      phone = campus.phone;
      
      // Update logo path if available
      if (campus.logoPath) {
        logoPath = campus.logoPath;
      } else {
        // Use default logo
        logoPath = "images/logos/district-logo.png";
      }
      
      // Update the display
      organizationSpan.textContent = organization;
      addressSpan.textContent = address;
      phoneSpan.textContent = phone;
    }
  }
  
  // Generate signature on form submission
  signatureForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateSignature();
  });
  
  // Copy signature to clipboard
  btnCopy.addEventListener('click', () => {
    copyToClipboard();
  });
  
  // Gmail Settings link is now a direct hyperlink in the HTML
  
  // Generate signature based on form inputs and static values
  function generateSignature() {
    const name = document.getElementById('name').value || "John Doe";
    const title = document.getElementById('title').value || "Coordinator"; // Use default value if empty
    const email = document.getElementById('email').value || "johndoe@celinaisd.com";
    
    // Create signature HTML with the structure from signexample.html
    const signatureHtml = `
      <div dir="ltr" style="mso-line-height-rule: exactly; -webkit-text-size-adjust: 100%; font-size: 1px; direction: ltr;">
        <table dir="ltr" cellpadding="0" cellspacing="0" border="0" style="width: 100%; direction: ltr; border-collapse: collapse; font-size: 1px;">
            <tbody>
                <tr style="font-size: 0;">
                    <td align="left" style="vertical-align: top;">
                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                            <tbody>
                                <tr style="font-size: 0;">
                                    <td align="left" style="vertical-align: top;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                                            <tbody>
                                                <tr style="font-size: 0;">
                                                    <td align="left" style="vertical-align: top;">
                                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                                                            <tbody>
                                                                <tr style="font-size: 0;">
                                                                    <td align="left" style="vertical-align: top;">
                                                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0; line-height: normal;">
                                                                            <tbody>
                                                                                <tr style="font-size: 0;">
                                                                                    <td align="left" style="padding: 0 10px 0 0; vertical-align: top;">
                                                                                        <img
                                                                                            src="${logoPath}"
                                                                                            width="200"
                                                                                            height="150"
                                                                                            border="0"
                                                                                            alt=""
                                                                                            style="width: 200px; min-width: 200px; max-width: 200px; height: 150px; min-height: 150px; max-height: 150px; font-size: 0;"
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td align="left" style="vertical-align: top;">
                                                                        <table
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            border="0"
                                                                            style="border-collapse: collapse; font-size: 0; color: #000001; font-style: normal; font-weight: 700; white-space: nowrap;"
                                                                        >
                                                                            <tbody>
                                                                                <tr style="font-size: 16px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 700;">
                                                                                        ${name}
                                                                                        <span style="font-family: remialcxesans; font-size: 1px; color: #ffffff; line-height: 1px;">
                                                                                            &ZeroWidthSpace;<span style="font-family: 'template-lPrnPSSYEfCLPQAiSCarSw';">&ZeroWidthSpace;</span>
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 0;">
                                                                                    <td align="left" style="vertical-align: top;">
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            style="border-collapse: collapse; font-size: 0; color: #000001; font-style: normal; font-weight: 400; white-space: nowrap;"
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr style="font-size: 14px;">
                                                                                                    <td align="left" style="padding: 0 0 10px; vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">
                                                                                                        ${title}<br />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">${organization}</td>
                                                                                </tr>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">
                                                                                        ${address}<br />
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 0;">
                                                                                    <td align="left" style="vertical-align: top;">
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            style="border-collapse: collapse; font-size: 0; color: #000001; font-style: normal; font-weight: 700; white-space: nowrap;"
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr style="font-size: 14px;">
                                                                                                    <td align="left" style="padding: 10px 0 0; vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">${email}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">${phone}<br /></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr style="font-size: 0;">
                                                    <td align="center" style="vertical-align: top;">
                                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                                                            <tbody>
                                                                <tr style="font-size: 0;">
                                                                    <td align="center" style="background-color: #746c6c; padding: 3px 8px; vertical-align: top;">
                                                                        <table
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            border="0"
                                                                            style="
                                                                                white-space: nowrap;
                                                                                color: #ffffff;
                                                                                font-size: 14.67px;
                                                                                font-family: Calibri, Arial, sans-serif;
                                                                                font-weight: 700;
                                                                                font-style: normal;
                                                                                text-align: center;
                                                                                line-height: 20px;
                                                                                width: 100%;
                                                                                border-collapse: collapse;
                                                                            "
                                                                        >
                                                                            <tbody>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td style="font-family: Calibri, Arial, sans-serif;">${tagline}<br /></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    `;
    
    // Update preview
    signaturePreview.innerHTML = signatureHtml;
    currentSignatureHtml = signatureHtml;
    
    // Show success message
    const formContainer = document.querySelector('.form-container');
    const existingMessage = formContainer.querySelector('.success-message');
    
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.backgroundColor = '#d4edda';
    successMessage.style.color = '#155724';
    successMessage.style.padding = '10px';
    successMessage.style.borderRadius = '4px';
    successMessage.style.marginTop = '15px';
    successMessage.textContent = 'Signature generated successfully!';
    
    formContainer.appendChild(successMessage);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  }
  
  // Copy Gmail-friendly signature HTML to clipboard
  function copyToClipboard() {
    if (!currentSignatureHtml) {
      alert('Please generate a signature first.');
      return;
    }
    
    const name = document.getElementById('name').value || "John Doe";
    const title = document.getElementById('title').value || "Coordinator";
    const email = document.getElementById('email').value || "johndoe@celinaisd.com";
    
    // Get the absolute URL for the logo
    const absoluteLogoUrl = new URL(logoPath, window.location.href).href;
    
    // Create a Gmail-friendly HTML structure with table layout and inline styles
    const gmailFriendlyHtml = `
      <div dir="ltr" style="mso-line-height-rule: exactly; -webkit-text-size-adjust: 100%; font-size: 1px; direction: ltr;">
        <table dir="ltr" cellpadding="0" cellspacing="0" border="0" style="width: 100%; direction: ltr; border-collapse: collapse; font-size: 1px;">
            <tbody>
                <tr style="font-size: 0;">
                    <td align="left" style="vertical-align: top;">
                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                            <tbody>
                                <tr style="font-size: 0;">
                                    <td align="left" style="vertical-align: top;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                                            <tbody>
                                                <tr style="font-size: 0;">
                                                    <td align="left" style="vertical-align: top;">
                                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                                                            <tbody>
                                                                <tr style="font-size: 0;">
                                                                    <td align="left" style="vertical-align: top;">
                                                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0; line-height: normal;">
                                                                            <tbody>
                                                                                <tr style="font-size: 0;">
                                                                                    <td align="left" style="padding: 0 10px 0 0; vertical-align: top;">
                                                                                        <img
                                                                                            src="${absoluteLogoUrl}"
                                                                                            width="200"
                                                                                            height="150"
                                                                                            border="0"
                                                                                            alt=""
                                                                                            style="width: 200px; min-width: 200px; max-width: 200px; height: 150px; min-height: 150px; max-height: 150px; font-size: 0;"
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td align="left" style="vertical-align: top;">
                                                                        <table
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            border="0"
                                                                            style="border-collapse: collapse; font-size: 0; color: #000001; font-style: normal; font-weight: 400; white-space: nowrap;"
                                                                        >
                                                                            <tbody>
                                                                                <tr style="font-size: 16px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 700;">
                                                                                        ${name}
                                                                                        <span style="font-family: remialcxesans; font-size: 1px; color: #ffffff; line-height: 1px;">
                                                                                            &ZeroWidthSpace;<span style="font-family: 'template-lPrnPSSYEfCLPQAiSCarSw';">&ZeroWidthSpace;</span>
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 0;">
                                                                                    <td align="left" style="vertical-align: top;">
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            style="border-collapse: collapse; font-size: 0; color: #000001; font-style: normal; font-weight: 400; white-space: nowrap;"
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr style="font-size: 14px;">
                                                                                                    <td align="left" style="padding: 0 0 10px; vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">
                                                                                                        ${title}<br />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">${organization}</td>
                                                                                </tr>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">
                                                                                        ${address}<br />
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 0;">
                                                                                    <td align="left" style="vertical-align: top;">
                                                                                        <table
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            style="border-collapse: collapse; font-size: 0; color: #000001; font-style: normal; font-weight: 400; white-space: nowrap;"
                                                                                        >
                                                                                            <tbody>
                                                                                                <tr style="font-size: 14px;">
                                                                                                    <td align="left" style="padding: 10px 0 0; vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">${email}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td align="left" style="vertical-align: top; font-family: Calibri, Arial, sans-serif; color: #746c6c; font-weight: 400;">${phone}<br /></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr style="font-size: 0;">
                                                    <td align="center" style="vertical-align: top;">
                                                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 0;">
                                                            <tbody>
                                                                <tr style="font-size: 0;">
                                                                    <td align="center" style="background-color: #746c6c; padding: 3px 8px; vertical-align: top;">
                                                                        <table
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            border="0"
                                                                            style="
                                                                                white-space: nowrap;
                                                                                color: #ffffff;
                                                                                font-size: 14.67px;
                                                                                font-family: Calibri, Arial, sans-serif;
                                                                                font-weight: 700;
                                                                                font-style: normal;
                                                                                text-align: center;
                                                                                line-height: 20px;
                                                                                width: 100%;
                                                                                border-collapse: collapse;
                                                                            "
                                                                        >
                                                                            <tbody>
                                                                                <tr style="font-size: 14px;">
                                                                                    <td style="font-family: Calibri, Arial, sans-serif;">${tagline}<br /></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    `;
    
    // Create a temporary div with the Gmail-friendly signature
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.opacity = '0';
    tempDiv.innerHTML = gmailFriendlyHtml;
    document.body.appendChild(tempDiv);
    
    try {
      // Create a range and selection
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Execute copy command
      document.execCommand('copy');
      selection.removeAllRanges();
      
      // Show copied feedback
      btnCopy.classList.add('copied');
      btnCopy.innerHTML = '<i class="fas fa-check"></i> Copied!';
      
      setTimeout(() => {
        btnCopy.classList.remove('copied');
        btnCopy.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard. Please try again.');
    }
    
    // Clean up
    document.body.removeChild(tempDiv);
  }
});
