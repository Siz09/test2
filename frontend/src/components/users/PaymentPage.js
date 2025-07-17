"use client"

import { useState } from "react"
import "../styles/venue-booking.css"
import "../styles/payment-page.css"
import "../styles/modern-components.css"

const PaymentPage = ({ bookingData, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [paymentForm, setPaymentForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // null, 'success', 'error'
  const [paymentError, setPaymentError] = useState("")

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  const handlePaymentFormChange = (field, value) => {
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleCardNumberChange = (value) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, "")

    // Format with spaces every 4 digits
    const formatted = digitsOnly
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .substring(0, 19) // Limit to 16 digits + 3 spaces

    handlePaymentFormChange("cardNumber", formatted)
  }

  const handleExpiryChange = (value) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, "")

    // Format as MM/YY
    let formatted = digitsOnly
    if (digitsOnly.length >= 2) {
      formatted = digitsOnly.substring(0, 2) + "/" + digitsOnly.substring(2, 4)
    }

    handlePaymentFormChange("expiryDate", formatted)
  }

  const handleCvvChange = (value) => {
    // Only allow digits, max 4 characters (for Amex)
    const formatted = value.replace(/\D/g, "").substring(0, 4)
    handlePaymentFormChange("cvv", formatted)
  }

  const validateCardNumber = (cardNumber) => {
    const digitsOnly = cardNumber.replace(/\s/g, "")

    if (!digitsOnly) return "Card number is required"
    if (digitsOnly.length < 13) return "Card number is too short"
    if (digitsOnly.length > 19) return "Card number is too long"

    // Luhn algorithm for card validation
    let sum = 0
    let isEven = false

    for (let i = digitsOnly.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(digitsOnly[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    if (sum % 10 !== 0) return "Invalid card number"
    return ""
  }

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) return "Expiry date is required"

    const [month, year] = expiryDate.split("/")
    if (!month || !year) return "Invalid expiry date format"

    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt("20" + year)

    if (monthNum < 1 || monthNum > 12) return "Invalid month"

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return "Card has expired"
    }

    return ""
  }

  const validateCvv = (cvv) => {
    if (!cvv) return "CVV is required"
    if (cvv.length < 3) return "CVV must be at least 3 digits"
    return ""
  }

  const validateForm = () => {
    const errors = {}

    if (paymentMethod === "credit-card") {
      if (!paymentForm.nameOnCard.trim()) {
        errors.nameOnCard = "Name on card is required"
      }

      errors.cardNumber = validateCardNumber(paymentForm.cardNumber)
      errors.expiryDate = validateExpiryDate(paymentForm.expiryDate)
      errors.cvv = validateCvv(paymentForm.cvv)
    }

    // Remove empty errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key]
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const simulatePaymentProcessing = () => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate random success/failure for demo
        const shouldSucceed = Math.random() > 0.2 // 80% success rate

        if (shouldSucceed) {
          resolve({
            transactionId: "TXN" + Date.now(),
            status: "success",
            message: "Payment processed successfully",
          })
        } else {
          reject({
            status: "error",
            message: "Payment failed. Please check your card details and try again.",
          })
        }
      }, 2000) // 2 second delay
    })
  }

  const handlePayment = async () => {
    // Reset previous states
    setPaymentError("")
    setPaymentStatus(null)

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      if (paymentMethod === "credit-card") {
        // Process credit card payment
        const result = await simulatePaymentProcessing()
        setPaymentStatus("success")

        // In a real app, you would redirect to success page or show confirmation
        setTransactionId(result.transactionId)
        setTimeout(() => {
          setShowSuccessModal(true)
        }, 500)
      } else if (paymentMethod === "esewa" || paymentMethod === "khalti") {
        // Simulate redirect to digital wallet
        setPaymentStatus("redirect")
        setTimeout(() => {
          // Simulate return from digital wallet
          const success = Math.random() > 0.3 // 70% success rate
          if (success) {
            setPaymentStatus("success")
            setTransactionId("TXN" + Date.now())
            setShowSuccessModal(true)
          } else {
            setPaymentStatus("error")
            setPaymentError("Payment was cancelled or failed in " + (paymentMethod === "esewa" ? "eSewa" : "Khalti"))
          }
        }, 3000)
      }
    } catch (error) {
      setPaymentStatus("error")
      setPaymentError(error.message || "Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    return timeString
  }

  const calculateDetailedPricing = () => {
    const basePrice = 15000
    const duration = Number.parseInt(bookingData.duration) || 2
    const guestCount = Number.parseInt(bookingData.guests) || 0

    const subtotal = basePrice * duration
    const serviceCharge = Math.round(subtotal * 0.1) // 10% service charge
    const tax = Math.round((subtotal + serviceCharge) * 0.13) // 13% VAT
    const guestFee = guestCount > 100 ? (guestCount - 100) * 50 : 0 // Extra fee for guests over 100

    const total = subtotal + serviceCharge + tax + guestFee

    return {
      basePrice,
      duration,
      subtotal,
      serviceCharge,
      tax,
      guestFee,
      total,
    }
  }

  const getCardType = (cardNumber) => {
    const digitsOnly = cardNumber.replace(/\s/g, "")

    if (digitsOnly.startsWith("4")) return "Visa"
    if (digitsOnly.startsWith("5") || digitsOnly.startsWith("2")) return "Mastercard"
    if (digitsOnly.startsWith("3")) return "American Express"
    if (digitsOnly.startsWith("6")) return "Discover"

    return ""
  }

  const pricing = calculateDetailedPricing()

  const downloadReceipt = () => {
    const receiptData = {
      transactionId: transactionId || "TXN" + Date.now(),
      venue: "Grand Ballroom",
      date: formatDate(bookingData.date),
      time: formatTime(bookingData.startTime),
      duration: bookingData.duration + " hours",
      guests: bookingData.guests,
      total: "NPR " + pricing.total.toLocaleString(),
      paymentMethod:
        paymentMethod === "credit-card" ? "Credit/Debit Card" : paymentMethod === "esewa" ? "eSewa" : "Khalti",
      bookingDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    const receiptContent = `
BOOKING RECEIPT
===============

Transaction ID: ${receiptData.transactionId}
Booking Date: ${receiptData.bookingDate}

VENUE DETAILS
-------------
Venue: ${receiptData.venue}
Date: ${receiptData.date}
Time: ${receiptData.time}
Duration: ${receiptData.duration}
Number of Guests: ${receiptData.guests}

PAYMENT DETAILS
---------------
Payment Method: ${receiptData.paymentMethod}
Total Amount: ${receiptData.total}

Thank you for choosing our venue!
For any queries, please contact our support team.
    `.trim()

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${receiptData.transactionId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Show success state
  if (paymentStatus === "success") {
    return (
      <div className="venue-booking-page">
        <section className="venue-payment-hero">
          <div className="venue-hero-content">
            <h1 className="venue-payment-title">Payment Successful!</h1>
          </div>
        </section>

        <main className="venue-main-content">
          <div className="venue-payment-success">
            <div className="venue-success-card">
              <div className="venue-success-icon">✓</div>
              <h2>Booking Confirmed</h2>
              <p>Your payment has been processed successfully and your venue booking is confirmed.</p>

              <div className="venue-success-details">
                <h3>Booking Details</h3>
                <div className="venue-success-item">
                  <span>Venue:</span>
                  <span>Grand Ballroom</span>
                </div>
                <div className="venue-success-item">
                  <span>Date:</span>
                  <span>{formatDate(bookingData.date)}</span>
                </div>
                <div className="venue-success-item">
                  <span>Time:</span>
                  <span>{formatTime(bookingData.startTime)}</span>
                </div>
                <div className="venue-success-item">
                  <span>Duration:</span>
                  <span>{bookingData.duration} hours</span>
                </div>
                <div className="venue-success-item">
                  <span>Guests:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <div className="venue-success-item venue-success-total">
                  <span>Total Paid:</span>
                  <span>NPR {pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <button className="venue-success-btn" onClick={downloadReceipt}>
                Download Receipt
              </button>
              <button className="venue-success-btn-secondary" onClick={() => window.location.reload()}>
                Book Another Venue
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }
  showSuccessModal && (
    <div className="venue-modal-overlay" onClick={() => setShowSuccessModal(false)}>
      <div className="venue-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="venue-modal-header">
          <div className="venue-modal-success-icon">✓</div>
          <h3>Payment Successful!</h3>
          <button className="venue-modal-close" onClick={() => setShowSuccessModal(false)}>
            ×
          </button>
        </div>
        <div className="venue-modal-body">
          <p>Your payment has been processed successfully.</p>
          <div className="venue-modal-details">
            <div className="venue-modal-detail-item">
              <span>Transaction ID:</span>
              <span>{transactionId}</span>
            </div>
            <div className="venue-modal-detail-item">
              <span>Booking Date:</span>
              <span>{formatDate(bookingData.date)}</span>
            </div>
            <div className="venue-modal-detail-item">
              <span>Amount:</span>
              <span>NPR {pricing.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="venue-modal-actions">
          <button className="venue-modal-btn-primary" onClick={() => setShowSuccessModal(false)}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
  showErrorModal && (
    <div className="venue-modal-overlay" onClick={() => setShowErrorModal(false)}>
      <div className="venue-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="venue-modal-header venue-modal-error">
          <div className="venue-modal-error-icon">⚠</div>
          <h3>Payment Failed</h3>
          <button className="venue-modal-close" onClick={() => setShowErrorModal(false)}>
            ×
          </button>
        </div>
        <div className="venue-modal-body">
          <p>{paymentError || "Something went wrong. Please try again."}</p>
        </div>
        <div className="venue-modal-actions">
          <button className="venue-modal-btn-secondary" onClick={() => setShowErrorModal(false)}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="venue-booking-page">
      {/* Hero Section */}
      <section className="venue-payment-hero">
        <div className="venue-hero-content">
          <h1 className="venue-payment-title">Complete your payment</h1>
        </div>
      </section>

      {/* Payment Content */}
      <main className="venue-main-content">
        <div className="venue-payment-grid">
          {/* Left Column - Payment Form */}
          <div className="venue-payment-section">
            <div className="venue-payment-card">
              <div className="venue-payment-method-section">
                <h3 className="venue-payment-section-title">Payment Method</h3>
                <p className="venue-payment-section-subtitle">Select your preferred payment method</p>

                <div className="venue-payment-methods">
                  <label className="venue-payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="venue-payment-radio"
                      disabled={isProcessing}
                    />
                    <span className="venue-payment-method-label">Credit/Debit Card</span>
                  </label>

                  <label className="venue-payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={paymentMethod === "esewa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="venue-payment-radio"
                      disabled={isProcessing}
                    />
                    <span className="venue-payment-method-label">eSewa</span>
                  </label>

                  <label className="venue-payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={paymentMethod === "khalti"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="venue-payment-radio"
                      disabled={isProcessing}
                    />
                    <span className="venue-payment-method-label">Khalti</span>
                  </label>
                </div>
              </div>

              {paymentMethod === "credit-card" && (
                <div className="venue-payment-form-section">
                  <div className="venue-form-group">
                    <label className="venue-form-label" htmlFor="name-on-card">
                      Name on Card *
                    </label>
                    <input
                      id="name-on-card"
                      type="text"
                      className={`venue-form-input ${formErrors.nameOnCard ? "venue-payment-error" : ""}`}
                      placeholder="John Joy"
                      value={paymentForm.nameOnCard}
                      onChange={(e) => handlePaymentFormChange("nameOnCard", e.target.value)}
                      disabled={isProcessing}
                    />
                    {formErrors.nameOnCard && (
                      <div className="venue-payment-error-message">{formErrors.nameOnCard}</div>
                    )}
                  </div>

                  <div className="venue-form-group">
                    <label className="venue-form-label" htmlFor="card-number">
                      Card Number *
                    </label>
                    <div className="venue-card-input-container">
                      <input
                        id="card-number"
                        type="text"
                        className={`venue-form-input ${formErrors.cardNumber ? "venue-payment-error" : ""}`}
                        placeholder="1234 5678 9012 3456"
                        value={paymentForm.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        disabled={isProcessing}
                      />
                      {getCardType(paymentForm.cardNumber) && (
                        <div className="venue-card-type">{getCardType(paymentForm.cardNumber)}</div>
                      )}
                    </div>
                    {formErrors.cardNumber && (
                      <div className="venue-payment-error-message">{formErrors.cardNumber}</div>
                    )}
                  </div>

                  <div className="venue-payment-form-row">
                    <div className="venue-form-group">
                      <label className="venue-form-label" htmlFor="expiry-date">
                        Expiry Date *
                      </label>
                      <input
                        id="expiry-date"
                        type="text"
                        className={`venue-form-input ${formErrors.expiryDate ? "venue-payment-error" : ""}`}
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        disabled={isProcessing}
                      />
                      {formErrors.expiryDate && (
                        <div className="venue-payment-error-message">{formErrors.expiryDate}</div>
                      )}
                    </div>

                    <div className="venue-form-group">
                      <label className="venue-form-label" htmlFor="cvv">
                        CVV *
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        className={`venue-form-input ${formErrors.cvv ? "venue-payment-error" : ""}`}
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        disabled={isProcessing}
                      />
                      {formErrors.cvv && <div className="venue-payment-error-message">{formErrors.cvv}</div>}
                    </div>
                  </div>

                  <div className="venue-payment-security">
                    <div className="venue-payment-security-icon">🔒</div>
                    <div className="venue-payment-security-text">Your payment information is encrypted and secure</div>
                  </div>
                </div>
              )}

              {(paymentMethod === "esewa" || paymentMethod === "khalti") && (
                <div className="venue-payment-form-section">
                  <div className="venue-payment-digital-wallet">
                    <p className="venue-payment-wallet-text">
                      You will be redirected to {paymentMethod === "esewa" ? "eSewa" : "Khalti"} to complete your
                      payment securely.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {paymentError && (
                <div className="venue-payment-error-banner">
                  <div className="venue-payment-error-icon">⚠</div>
                  <div>{paymentError}</div>
                </div>
              )}

              {/* Payment Button */}
              <button
                className={`venue-payment-btn ${isProcessing ? "venue-payment-loading" : ""}`}
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="venue-payment-btn-content">
                    <div className="venue-payment-spinner"></div>
                    {paymentStatus === "redirect" ? "Redirecting..." : "Processing Payment..."}
                  </div>
                ) : (
                  `Pay NPR ${pricing.total.toLocaleString()}`
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="venue-payment-summary-section">
            <div className="venue-payment-summary-card">
              <h3 className="venue-payment-summary-title">Booking Summary</h3>

              <div className="venue-payment-summary-details">
                <div className="venue-payment-summary-item">
                  <span className="venue-payment-summary-label">Venue</span>
                  <span className="venue-payment-summary-value">Grand Ballroom</span>
                </div>

                <div className="venue-payment-summary-item">
                  <span className="venue-payment-summary-label">Date</span>
                  <span className="venue-payment-summary-value">{formatDate(bookingData.date)}</span>
                </div>

                <div className="venue-payment-summary-item">
                  <span className="venue-payment-summary-label">Time</span>
                  <span className="venue-payment-summary-value">{formatTime(bookingData.startTime)}</span>
                </div>

                <div className="venue-payment-summary-item">
                  <span className="venue-payment-summary-label">Duration</span>
                  <span className="venue-payment-summary-value">{bookingData.duration} hours</span>
                </div>

                <div className="venue-payment-summary-item">
                  <span className="venue-payment-summary-label">Number of guests</span>
                  <span className="venue-payment-summary-value">{bookingData.guests}</span>
                </div>

                <div className="venue-payment-summary-total">
                  <span className="venue-payment-summary-total-label">Total</span>
                  <span className="venue-payment-summary-total-value">NPR {pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <button className="venue-payment-back-btn" onClick={onBack} disabled={isProcessing}>
                Back to booking details
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentPage
