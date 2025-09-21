// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useAuth } from "@/components/auth-provider"
// import { useRouter } from "next/navigation"
// import { Plus, X, Save,Loader } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface ProductData {
//   id: string
//   sku?: string
//   barcode?: string
//   packagingType: string
//   materials: { material: string; percentage: number }[]
//   unitWeight: number
//   recyclability: "yes" | "no" | "partial"
//   recyclabilityComments?: string
// }

// export function CompanyRegistrationForm() {
//   const { user, updateCompanyData } = useAuth()
//   const router = useRouter()
//   const { toast } = useToast()
  
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
  
//   const [formData, setFormData] = useState({
//     // Company identity
//     companyName: "",
//     brandNames: [""],
//     companyId: "",
//     contactPerson: "",
//     contactEmail: user?.email || "",
//     accountAdmin: "",
//     accountAdminEmail: user?.email || "",
//     logoUrl: "",

//     // Operational metadata
//     rvmPartnerIds: [""],
//     defaultCurrency: "USD",
//     defaultRegion: "",
//     materialMappingPreference: "",

//     // Products
//     products: [] as ProductData[],

//     // Targets & policy
//     sustainabilityTargets: "",
//     reportingBoundary: "",
//     verificationStatus: "self-reported" as "self-reported" | "third-party-verified",
//     certificateUrl: "",

//     // Permissions
//     consentPublicDashboard: false,
//     consentDataSharing: false,
//   })

//   // Load company data when component mounts
//   useEffect(() => {
//     const loadCompanyData = async () => {
//       if (!user?.id) {
//         setIsLoading(false)
//         return
//       }
      
//       try {
//         const response = await fetch(`/api/company?userId=${user.id}`)
//         const result = await response.json()
        
//         if (result.success && result.data) {
//           // Update form with existing data
//           setFormData(prev => ({
//             ...prev,
//             ...result.data,
//             // Ensure arrays are never empty
//             brandNames: result.data.brandNames && result.data.brandNames.length > 0 
//               ? result.data.brandNames : [""],
//             rvmPartnerIds: result.data.rvmPartnerIds && result.data.rvmPartnerIds.length > 0 
//               ? result.data.rvmPartnerIds : [""],
//             products: result.data.products || [],
//             // Use current user email if not set in database
//             contactEmail: result.data.contactEmail || user.email || "",
//             accountAdminEmail: result.data.accountAdminEmail || user.email || "",
//           }))
//         }
//       } catch (error) {
//         console.error('Error loading company data:', error)
//         toast({
//           title: "Error",
//           description: "Failed to load company data. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }
    
//     loadCompanyData()
//   }, [user, toast])

//   const addBrandName = () => {
//     setFormData((prev) => ({
//       ...prev,
//       brandNames: [...prev.brandNames, ""],
//     }))
//   }

//   const removeBrandName = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       brandNames: prev.brandNames.filter((_, i) => i !== index),
//     }))
//   }

//   const updateBrandName = (index: number, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       brandNames: prev.brandNames.map((name, i) => (i === index ? value : name)),
//     }))
//   }

//   const addRvmPartnerId = () => {
//     setFormData((prev) => ({
//       ...prev,
//       rvmPartnerIds: [...prev.rvmPartnerIds, ""],
//     }))
//   }

//   const removeRvmPartnerId = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       rvmPartnerIds: prev.rvmPartnerIds.filter((_, i) => i !== index),
//     }))
//   }

//   const updateRvmPartnerId = (index: number, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       rvmPartnerIds: prev.rvmPartnerIds.map((id, i) => (i === index ? value : id)),
//     }))
//   }

//   const addProduct = () => {
//     const newProduct: ProductData = {
//       id: Date.now().toString(),
//       packagingType: "",
//       materials: [{ material: "", percentage: 0 }],
//       unitWeight: 0,
//       recyclability: "yes",
//     }
//     setFormData((prev) => ({
//       ...prev,
//       products: [...prev.products, newProduct],
//     }))
//   }

//   const removeProduct = (productId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       products: prev.products.filter((p) => p.id !== productId),
//     }))
//   }

//   const updateProduct = (productId: string, updates: Partial<ProductData>) => {
//     setFormData((prev) => ({
//       ...prev,
//       products: prev.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
//     }))
//   }



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
    
//     try {
//       // Format the data for API Gateway
//       const apiData = {
//         ...formData,
//         userId: user?.id, // Include user ID
//         userEmail: user?.email, // Include user email
//         // Clean up empty values from arrays
//         brandNames: formData.brandNames,
//         rvmPartnerIds: formData.rvmPartnerIds,
//       }
// //.filter(name => name.trim() !== "")
// //.filter(id => id.trim() !== "")
//       // Send data to our API route which will forward to API Gateway
//       const response = await fetch('/api/company', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(apiData),
//       })
      
//       const result = await response.json()
      
//       if (result.success) {
//         // Update local state
//         updateCompanyData(formData)
        
//         toast({
//           title: "Registration Successful",
//           description: "Your company registration has been saved successfully.",
//         })
        
//         router.push("/dashboard/reports")
//       } else {
//         throw new Error(result.error || 'Failed to save company data')
//       }
//     } catch (error) {
//       console.error('Error saving company data:', error)
//       toast({
//         title: "Error",
//         description: "Failed to save company data. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p>Loading company data...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold">
//               {formData.companyName ? "Edit Company Registration" : "Create Company Registration"}
//             </CardTitle>
//             <CardDescription>
//               {formData.companyName 
//                 ? "Update your company details and registration information" 
//                 : "Complete your company registration to get started"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Company Identity */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold border-b pb-2">Company Identity</h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="companyName">Company Name *</Label>
//                     <Input
//                       id="companyName"
//                       value={formData.companyName}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="companyId">Company ID / Tax ID</Label>
//                     <Input
//                       id="companyId"
//                       value={formData.companyId}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, companyId: e.target.value }))}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Brand Names *</Label>
//                   {formData.brandNames.map((brand, index) => (
//                     <div key={index} className="flex gap-2 mt-2">
//                       <Input
//                         value={brand}
//                         onChange={(e) => updateBrandName(index, e.target.value)}
//                         placeholder="Brand name"
//                         required={index === 0}
//                       />
//                       {formData.brandNames.length > 1 && (
//                         <Button type="button" variant="outline" size="icon" onClick={() => removeBrandName(index)}>
//                           <X className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                   <Button type="button" variant="outline" onClick={addBrandName} className="mt-2 bg-transparent">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Brand
//                   </Button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="contactPerson">Contact Person *</Label>
//                     <Input
//                       id="contactPerson"
//                       value={formData.contactPerson}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="contactEmail">Contact Email *</Label>
//                     <Input
//                       id="contactEmail"
//                       type="email"
//                       value={formData.contactEmail}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="accountAdmin">Account Admin Name *</Label>
//                     <Input
//                       id="accountAdmin"
//                       value={formData.accountAdmin}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, accountAdmin: e.target.value }))}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="accountAdminEmail">Account Admin Email *</Label>
//                     <Input
//                       id="accountAdminEmail"
//                       type="email"
//                       value={formData.accountAdminEmail}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, accountAdminEmail: e.target.value }))}
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Operational Metadata */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold border-b pb-2">Operational Metadata</h3>

//                 <div>
//                   <Label>RVM Partner IDs *</Label>
//                   {formData.rvmPartnerIds.map((id, index) => (
//                     <div key={index} className="flex gap-2 mt-2">
//                       <Input
//                         value={id}
//                         onChange={(e) => updateRvmPartnerId(index, e.target.value)}
//                         placeholder="RVM Partner ID"
//                         required={index === 0}
//                       />
//                       {formData.rvmPartnerIds.length > 1 && (
//                         <Button type="button" variant="outline" size="icon" onClick={() => removeRvmPartnerId(index)}>
//                           <X className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                   <Button type="button" variant="outline" onClick={addRvmPartnerId} className="mt-2 bg-transparent">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add RVM Partner ID
//                   </Button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="defaultCurrency">Default Currency</Label>
//                     <Select
//                       value={formData.defaultCurrency}
//                       onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultCurrency: value }))}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="USD">USD</SelectItem>
//                         <SelectItem value="EUR">EUR</SelectItem>
//                         <SelectItem value="GBP">GBP</SelectItem>
//                         <SelectItem value="JPY">JPY</SelectItem>
//                         <SelectItem value="MY">MY</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="defaultRegion">Default Region</Label>
//                     <Input
//                       id="defaultRegion"
//                       value={formData.defaultRegion}
//                       onChange={(e) => setFormData((prev) => ({ ...prev, defaultRegion: e.target.value }))}
//                       placeholder="e.g., North America, Europe"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="materialMappingPreference">Material Mapping Preference *</Label>
//                   <Textarea
//                     id="materialMappingPreference"
//                     value={formData.materialMappingPreference}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, materialMappingPreference: e.target.value }))}
//                     placeholder="Describe how your brand maps SKUs to materials"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Product Data */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold border-b pb-2">Product Data</h3>

//                 {formData.products.map((product, index) => (
//                   <Card key={product.id} className="p-4">
//                     <div className="flex justify-between items-center mb-4">
//                       <h4 className="font-medium">Product {index + 1}</h4>
//                       <Button type="button" variant="outline" size="sm" onClick={() => removeProduct(product.id)}>
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label>SKU</Label>
//                         <Input
//                           value={product.sku || ""}
//                           onChange={(e) => updateProduct(product.id, { sku: e.target.value })}
//                         />
//                       </div>
//                       <div>
//                         <Label>Barcode</Label>
//                         <Input
//                           value={product.barcode || ""}
//                           onChange={(e) => updateProduct(product.id, { barcode: e.target.value })}
//                         />
//                       </div>
//                       <div>
//                         <Label>Packaging Type *</Label>
//                         <Select
//                           value={product.packagingType}
//                           onValueChange={(value) => updateProduct(product.id, { packagingType: value })}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="bottle">Bottle</SelectItem>
//                             <SelectItem value="can">Can</SelectItem>
//                             <SelectItem value="carton">Carton</SelectItem>
//                             <SelectItem value="pouch">Pouch</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div>
//                         <Label>Unit Weight (g) *</Label>
//                         <Input
//                           type="number"
//                           value={product.unitWeight}
//                           onChange={(e) =>
//                             updateProduct(product.id, { unitWeight: Number.parseFloat(e.target.value) || 0 })
//                           }
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label>Recyclability *</Label>
//                         <Select
//                           value={product.recyclability}
//                           onValueChange={(value: "yes" | "no" | "partial") =>
//                             updateProduct(product.id, { recyclability: value })
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="yes">Yes</SelectItem>
//                             <SelectItem value="no">No</SelectItem>
//                             <SelectItem value="partial">Partial</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}

//                 <Button type="button" variant="outline" onClick={addProduct}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Product
//                 </Button>
//               </div>

//               {/* Targets & Policy */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold border-b pb-2">Targets & Policy</h3>

//                 <div>
//                   <Label htmlFor="sustainabilityTargets">Sustainability Targets</Label>
//                   <Textarea
//                     id="sustainabilityTargets"
//                     value={formData.sustainabilityTargets}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, sustainabilityTargets: e.target.value }))}
//                     placeholder="e.g., Recover 50% of sold packaging by 2030"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="reportingBoundary">Reporting Boundary</Label>
//                   <Textarea
//                     id="reportingBoundary"
//                     value={formData.reportingBoundary}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, reportingBoundary: e.target.value }))}
//                     placeholder="e.g., returns to our brand-labeled RVMs only"
//                   />
//                 </div>

//                 <div>
//                   <Label>Verification Status</Label>
//                   <Select
//                     value={formData.verificationStatus}
//                     onValueChange={(value: "self-reported" | "third-party-verified") =>
//                       setFormData((prev) => ({ ...prev, verificationStatus: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="self-reported">Self-reported</SelectItem>
//                       <SelectItem value="third-party-verified">Third-party Verified</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="consentPublicDashboard"
//                       checked={formData.consentPublicDashboard}
//                       onCheckedChange={(checked) =>
//                         setFormData((prev) => ({ ...prev, consentPublicDashboard: !!checked }))
//                       }
//                     />
//                     <Label htmlFor="consentPublicDashboard">
//                       Consent to publish aggregated metrics to public dashboard
//                     </Label>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="consentDataSharing"
//                       checked={formData.consentDataSharing}
//                       onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consentDataSharing: !!checked }))}
//                     />
//                     <Label htmlFor="consentDataSharing">
//                       Consent to share anonymized transactional data with auditors/partners
//                     </Label>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-4 pt-6 border-t">
//                 <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   <Save className="h-4 w-4 mr-2" />
//                   {isSubmitting ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Plus, X, Save, Loader } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductData {
  id: string
  sku?: string
  barcode?: string
  packagingType: string
  materials: { material: string; percentage: number }[]
  unitWeight: number
  recyclability: "yes" | "no" | "partial"
  recyclabilityComments?: string
}

// Define the expected company data structure
interface CompanyData {
  companyName: string
  brandNames: string[]
  companyId: string
  contactPerson: string
  contactEmail: string
  accountAdminName: string
  accountAdminEmail: string
  logoUrl: string
  rvmPartnerIds: string[]
  defaultCurrency: string
  defaultRegion: string
  materialMapping: string
  products: ProductData[]
  targets: string
  reportingBoundary: string
  verificationStatus: "self-reported" | "third-party-verified"
  verificationCertificateUrl: string
  consentPublicMetrics: boolean
  consentShareData: boolean
}

export function CompanyRegistrationForm() {
  const { user, updateCompanyData } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<CompanyData>({
    // Company identity
    companyName: "",
    brandNames: [""],
    companyId: "",
    contactPerson: "",
    contactEmail: user?.email || "",
    accountAdminName: "",
    accountAdminEmail: user?.email || "",
    logoUrl: "",

    // Operational metadata
    rvmPartnerIds: [""],
    defaultCurrency: "USD",
    defaultRegion: "",
    materialMapping: "",

    // Products
    products: [],

    // Targets & policy
    targets: "",
    reportingBoundary: "",
    verificationStatus: "self-reported",
    verificationCertificateUrl: "",

    // Permissions
    consentPublicMetrics: false,
    consentShareData: false,
  })

  // Load company data when component mounts
  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/company?userId=${user.id}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          // Filter out unwanted fields from API response
          const {
            statusCode,
            body,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ...cleanData
          } = result.data;
          
          // Update form with existing data
          setFormData(prev => ({
            ...prev,
            ...cleanData,
            // Ensure arrays are never empty
            brandNames: cleanData.brandNames && cleanData.brandNames.length > 0 
              ? cleanData.brandNames : [""],
            rvmPartnerIds: cleanData.rvmPartnerIds && cleanData.rvmPartnerIds.length > 0 
              ? cleanData.rvmPartnerIds : [""],
            products: cleanData.products || [],
            // Use current user email if not set in database
            contactEmail: cleanData.contactEmail || user.email || "",
            accountAdminEmail: cleanData.accountAdminEmail || user.email || "",
          }))
        }
      } catch (error) {
        console.error('Error loading company data:', error)
        toast({
          title: "Error",
          description: "Failed to load company data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCompanyData()
  }, [user, toast])

  const addBrandName = () => {
    setFormData((prev) => ({
      ...prev,
      brandNames: [...prev.brandNames, ""],
    }))
  }

  const removeBrandName = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brandNames: prev.brandNames.filter((_, i) => i !== index),
    }))
  }

  const updateBrandName = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      brandNames: prev.brandNames.map((name, i) => (i === index ? value : name)),
    }))
  }

  const addRvmPartnerId = () => {
    setFormData((prev) => ({
      ...prev,
      rvmPartnerIds: [...prev.rvmPartnerIds, ""],
    }))
  }

  const removeRvmPartnerId = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rvmPartnerIds: prev.rvmPartnerIds.filter((_, i) => i !== index),
    }))
  }

  const updateRvmPartnerId = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rvmPartnerIds: prev.rvmPartnerIds.map((id, i) => (i === index ? value : id)),
    }))
  }

  const addProduct = () => {
    const newProduct: ProductData = {
      id: Date.now().toString(),
      packagingType: "",
      materials: [{ material: "", percentage: 0 }],
      unitWeight: 0,
      recyclability: "yes",
    }
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
  }

  const removeProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }))
  }

  const updateProduct = (productId: string, updates: Partial<ProductData>) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Format the data for API Gateway - only include necessary fields
      const apiData = {
        userId: user?.id,
        companyName: formData.companyName,
        brandNames: formData.brandNames.filter(name => name.trim() !== ""),
        companyId: formData.companyId,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        accountAdminName: formData.accountAdminName,
        accountAdminEmail: formData.accountAdminEmail,
        logoUrl: formData.logoUrl,
        rvmPartnerIds: formData.rvmPartnerIds.filter(id => id.trim() !== ""),
        defaultCurrency: formData.defaultCurrency,
        defaultRegion: formData.defaultRegion,
        materialMapping: formData.materialMapping,
        products: formData.products,
        targets: formData.targets,
        reportingBoundary: formData.reportingBoundary,
        verificationStatus: formData.verificationStatus,
        verificationCertificateUrl: formData.verificationCertificateUrl,
        consentPublicMetrics: formData.consentPublicMetrics,
        consentShareData: formData.consentShareData,
     
      }

      // Send data to our API route which will forward to API Gateway
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Update local state
        updateCompanyData(formData)
        
        toast({
          title: "Registration Successful",
          description: "Your company registration has been saved successfully.",
        })
        
        router.push("/dashboard")
      } else {
        throw new Error(result.error || 'Failed to save company data')
      }
    } catch (error) {
      console.error('Error saving company data:', error)
      toast({
        title: "Error",
        description: "Failed to save company data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading company data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {formData.companyName ? "Edit Company Registration" : "Create Company Registration"}
            </CardTitle>
            <CardDescription>
              {formData.companyName 
                ? "Update your company details and registration information" 
                : "Complete your company registration to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Identity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Company Identity</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyId">Company ID / Tax ID</Label>
                    <Input
                      id="companyId"
                      value={formData.companyId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyId: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Brand Names *</Label>
                  {formData.brandNames.map((brand, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={brand}
                        onChange={(e) => updateBrandName(index, e.target.value)}
                        placeholder="Brand name"
                        required={index === 0}
                      />
                      {formData.brandNames.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeBrandName(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addBrandName} className="mt-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Brand
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountAdmin">Account Admin Name *</Label>
                    <Input
                      id="accountAdmin"
                      value={formData.accountAdminName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, accountAdmin: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountAdminEmail">Account Admin Email *</Label>
                    <Input
                      id="accountAdminEmail"
                      type="email"
                      value={formData.accountAdminEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, accountAdminEmail: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Operational Metadata */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Operational Metadata</h3>

                <div>
                  <Label>RVM Partner IDs *</Label>
                  {formData.rvmPartnerIds.map((id, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={id}
                        onChange={(e) => updateRvmPartnerId(index, e.target.value)}
                        placeholder="RVM Partner ID"
                        required={index === 0}
                      />
                      {formData.rvmPartnerIds.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeRvmPartnerId(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRvmPartnerId} className="mt-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add RVM Partner ID
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Select
                      value={formData.defaultCurrency}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultCurrency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="MY">MY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="defaultRegion">Default Region</Label>
                    <Input
                      id="defaultRegion"
                      value={formData.defaultRegion}
                      onChange={(e) => setFormData((prev) => ({ ...prev, defaultRegion: e.target.value }))}
                      placeholder="e.g., North America, Europe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="materialMappingPreference">Material Mapping Preference *</Label>
                  <Textarea
                    id="materialMappingPreference"
                    value={formData.materialMapping}
                    onChange={(e) => setFormData((prev) => ({ ...prev, materialMappingPreference: e.target.value }))}
                    placeholder="Describe how your brand maps SKUs to materials"
                    required
                  />
                </div>
              </div>

              {/* Product Data */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Product Data</h3>

                {formData.products.map((product, index) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Product {index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeProduct(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>SKU</Label>
                        <Input
                          value={product.sku || ""}
                          onChange={(e) => updateProduct(product.id, { sku: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Barcode</Label>
                        <Input
                          value={product.barcode || ""}
                          onChange={(e) => updateProduct(product.id, { barcode: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Packaging Type *</Label>
                        <Select
                          value={product.packagingType}
                          onValueChange={(value) => updateProduct(product.id, { packagingType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottle">Bottle</SelectItem>
                            <SelectItem value="can">Can</SelectItem>
                            <SelectItem value="carton">Carton</SelectItem>
                            <SelectItem value="pouch">Pouch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Unit Weight (g) *</Label>
                        <Input
                          type="number"
                          value={product.unitWeight}
                          onChange={(e) =>
                            updateProduct(product.id, { unitWeight: Number.parseFloat(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Recyclability *</Label>
                        <Select
                          value={product.recyclability}
                          onValueChange={(value: "yes" | "no" | "partial") =>
                            updateProduct(product.id, { recyclability: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button type="button" variant="outline" onClick={addProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Targets & Policy */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Targets & Policy</h3>

                <div>
                  <Label htmlFor="sustainabilityTargets">Sustainability Targets</Label>
                  <Textarea
                    id="sustainabilityTargets"
                    value={formData.targets}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sustainabilityTargets: e.target.value }))}
                    placeholder="e.g., Recover 50% of sold packaging by 2030"
                  />
                </div>

                <div>
                  <Label htmlFor="reportingBoundary">Reporting Boundary</Label>
                  <Textarea
                    id="reportingBoundary"
                    value={formData.reportingBoundary}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reportingBoundary: e.target.value }))}
                    placeholder="e.g., returns to our brand-labeled RVMs only"
                  />
                </div>

                <div>
                  <Label>Verification Status</Label>
                  <Select
                    value={formData.verificationStatus}
                    onValueChange={(value: "self-reported" | "third-party-verified") =>
                      setFormData((prev) => ({ ...prev, verificationStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self-reported">Self-reported</SelectItem>
                      <SelectItem value="third-party-verified">Third-party Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentPublicDashboard"
                      checked={formData.consentPublicMetrics}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, consentPublicDashboard: !!checked }))
                      }
                    />
                    <Label htmlFor="consentPublicDashboard">
                      Consent to publish aggregated metrics to public dashboard
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentDataSharing"
                      checked={formData.consentShareData}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consentDataSharing: !!checked }))}
                    />
                    <Label htmlFor="consentDataSharing">
                      Consent to share anonymized transactional data with auditors/partners
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}