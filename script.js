
const leadForm = document.getElementById("leadForm");
const exportBtn = document.getElementById("exportBtn");
const leadList = document.getElementById("leadList");
let leads = [];

leadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  leads.push({ name, email });
  displayLeads();
  leadForm.reset();
});

exportBtn.addEventListener("click", () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    leads.map(e => `${e.name},${e.email}`).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function displayLeads() {
  leadList.innerHTML = leads.map(l => `<p>${l.name} (${l.email})</p>`).join("");
}

// Paystack Integration
function payWithPaystack() {
  var handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Paystack public key
    email: 'customer@email.com',
    amount: 30000, // Amount in kobo (30000 = R300)
    currency: "ZAR",
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      alert('Payment successful. Transaction ref is ' + response.reference);
    },
    onClose: function() {
      alert('Transaction was not completed, window closed.');
    }
  });
  handler.openIframe();
}
