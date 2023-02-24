import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    Button,
    Container,
    Flex,
  } from '@chakra-ui/react'
import style from "../Style/SingleProduct.module.css"
import { FcApproval } from "react-icons/fc";
import { FaHotjar } from "react-icons/fa";
import {BsStar, BsStarFill, BsStarHalf} from "react-icons/bs"
import {useState,useEffect} from "react"
import { BASE_URL } from '../constants/apiConstants';
import axios from "axios"
import { useToast } from '@chakra-ui/react'
import Carousel from '../components/singleProductCarousel';
import WithSubnavigation from "../components/Navbar"
import Footer from '../components/Footer';
import { useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cartError, cartLoading, cartSuccess } from '../redux/cart/cartAction';

//singleProduct page
function SingleProduct(){
    const [count,setCount]=useState(1)
    const [data,setData]=useState({})

    const toast = useToast()

    const navigate=useNavigate()
    const location=useLocation();
    console.log("location",location)

    const dispatch=useDispatch()

    const {user}=useSelector((store)=>store.auth)
    const {product}=useSelector((store)=>store.cart)
      console.log(user[0].email)
    //   const obj={
    //     user:user[0].email,
    //     product:data,
    //     quantity:count
    //   }
    //   console.log("obj",obj)

    function Star(rating) {
        return (
          <Box display="flex" alignItems="center">
            {Array(5)
              .fill('')
              .map((_, i) => {
                const roundedRating = Math.round(rating * 2) / 2;
                if (roundedRating - i >= 1) {
                  return (
                    <BsStarFill
                      key={i}
                      style={{ marginLeft: '1' }}
                      color={i < rating ? 'teal.500' : 'gray.300'}
                    />
                  );
                }
                if (roundedRating - i === 0.5) {
                  return <BsStarHalf key={i} style={{ marginLeft: '1' }} />;
                }
                return <BsStar key={i} style={{ marginLeft: '1' }} />;
              })}
            
          </Box>
        );
      }
      
    
     
    const handleClick=(id)=>{
        console.log("id",id)
          dispatch(cartLoading())
        //   if(data){
        //     let flag=false
        //     product.map((el)=>{
        //       if(el.id===id){
        //         flag=true
        //         alert("Already added to cart")
        //       }
        //       return el;
        //     })

        //     if(!flag){
        //         const payload={
        //             user:user[0].email,
        //             userProduct:[...product, {...data,quantity:1}],
        //         }
        //         axios.post(`${BASE_URL}/cart`,payload)
        //         .then((res)=>{
        //         dispatch(cartSuccess(res.data))
        //         toast({
        //             title: 'Add to Cart',
        //             description: "Your Product Added in Cart!.",
        //             status: 'success',
        //             duration: 2000,
        //             isClosable: true,
        //           })
        //       })
        //       .catch((err)=>{
        //         dispatch(cartError())
        //         toast({
        //             title: 'Add to Cart',
        //             description: "Something Error..!.",
        //             status: 'Error',
        //             duration: 2000,
        //             isClosable: true,
        //           })
        //       })
        //     }
           
         // }
          

    }

    const handleGetData=()=>{
        axios.get(`${BASE_URL}${location.pathname}`)
        .then((res)=>{
            setData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    const handleCartlocate=()=>{
        navigate('/cart')
    }
    useEffect(()=>{
        handleGetData()
    },[])
    console.log("singdata",data)
    const handleQuantityPlus=(id)=>{
        product.map((el)=>{
            if(el.id===id){
                return{
                    ...el,
                    quantity:el.quantity+1
                }
            }
            return el
            
        })


        axios.patch(`${BASE_URL}/cart/${id}`, {userProduct:[...product]})

    }

    const handleQuantityMinus=(id)=>{
        product.map((el)=>{
            if(el.id===id){
                return{
                    ...el,
                    quantity:el.quantity-1<0?0:el.quantity-1
                }
            }
            return el
        })

        axios.patch(`${BASE_URL}/cart/${id}`, {userProduct:[...product]})
    }
    return(
        <div>
            {/* <WithSubnavigation/> */}
            <br />
        <div className={style.singleProduct}>
            <div>
               <Breadcrumb fontWeight='medium' fontSize='sm'>
                 <BreadcrumbItem>
                 <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>

                 <BreadcrumbItem>
                   <BreadcrumbLink href='#'>Products</BreadcrumbLink>
                 </BreadcrumbItem>

                 <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>SingleProduct</BreadcrumbLink>
                 </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <div className={style.SingleProductBox}>
                <div className={style.SingleProductBoxfirst}>
                    <img src={data.image} alt="imagename" />
                </div>
                <div className={style.SingleProductBoxsecond}>
                    {/* <div className={style.SingleProductBoxthirdDiv}>
                        <div style={{fontSize:"30px"}}><FcApproval/></div>
                        <div>
                           <h3 style={{fontWeight:"bold",fontSize:"30px"}}>eBay Refurbished</h3>
                        </div>
                    </div> */}
                    <div>
                        <h1 style={{fontSize:"25px",fontWeight:"bold"}}>{data.title}</h1>
                    </div>
                    <br />
                    <Flex gap={3} alignItems={'center'}>
                        <div style={{color:"#DD1E31"}}><FaHotjar/></div>
                        <div><p style={{color:"#DD1E31"}}>{data.reviews} watched in the last 24 hours</p></div>
                        <Flex gap={2}>
                            {/* <div style={{color:"orange"}}><BsStarFill/></div>
                            <div style={{color:"orange"}}><BsStarFill/></div>
                            <div style={{color:"orange"}}><BsStarFill/></div>
                            <div style={{color:"orange"}}><BsStarFill/></div>
                            <div style={{color:"orange"}}><BsStarFill/></div> */}
                            {Star(data.rating)}
                        </Flex>
                        <p>{data.rating} products ratings</p>
                        
                    </Flex>
                    <hr />
                    <div>
                        <h3>Condition: Excellent - Refurbished</h3>
                        <p>"Limited quantity available"</p>
                        <h1 style={{fontSize:"17px",fontWeight:"bold"}}>Quantity:</h1>
                        <Flex gap={2}>
                            <Button disabled={count==1} onClick={()=>handleQuantityPlus(data.id)}>-</Button>
                            <Button disabled>{count}</Button>
                            <Button disabled={count==5} onClick={()=>handleQuantityMinus(data.id)}>+</Button>
                        </Flex>
                        <br />
                        <h1 style={{fontSize:"17px",fontWeight:"bold"}}>Price: <span> ${data.price*count}</span></h1>
                        <br />
                        <hr />
                    </div>
                    <hr />
                    <br />
                    <div>
                        <Button bg={"orange.500"} color={"white"} onClick={handleCartlocate}>Check Cart</Button>
                        <br />
                        <br />
                        <Button onClick={()=>handleClick(data.id)} bg={"green.700"} color={"white"}>Add to Cart</Button>
                        <br />
                    </div>
                    <br />
                    <hr />
                    <br />
                    <div>
                        <Flex gap={5}>
                            <h2 style={{color:"#DD1E31",fontWeight:"bold"}}>Free shipping and returns</h2>
                            <h2 style={{fontWeight:"bold"}}>{data.reviews} watchers</h2>
                            <h2 style={{fontWeight:"bold"}}>28 sold</h2>
                        </Flex>
                    </div>
                    <br />
                    <div>
                        <h1><span style={{fontWeight:"bold"}}>Shipping: </span>
                            FREE Expedited Shipping </h1>
                        <p><span style={{fontWeight:"bold"}}>Located in: </span> Addison, Texas, United States</p>
                        <h1><span style={{fontWeight:"bold"}}>Delivery: </span>Estimated between Fri, Feb 24 and Mon, Feb 27 to default</h1>
                        <h1><span style={{fontWeight:"bold"}}>Returns: </span>60 day returns | Seller pays for return shipping</h1>
                        <h1><span style={{fontWeight:"bold"}}>Payments: </span>PayPal, GPay, Visa</h1>
                    </div>
                    <br />
                    <hr />
                </div>
                <div className={style.SingleProductBoxthird}>
                    <h2 style={{fontWeight:"bold"}}>Shop with confidence</h2>
                    <div className={style.SingleProductBoxthirdDiv}>
                        <div style={{fontSize:"40px"}}><FcApproval/></div>
                        <div>
                           <h3 style={{fontWeight:"bold"}}>eBay Refurbished</h3>
                           <p>All items are tested by qualified refurbishers and function as intended.</p>
                           <a style={{color:"blue"}} href="#">Learn More</a>
                        </div>
                    </div>
                    <hr />
                    <div className={style.SingleProductBoxthirdDiv}>
                        <div style={{fontSize:"40px"}}><FcApproval/></div>
                        <div>
                           <h3 style={{fontWeight:"bold"}}>One-year warranty included</h3>
                           <p>Protected with fast repairs or replacements. U.S residents only. Your email is shared with Allstate for a frictionless experience.</p>
                           <a style={{color:"blue"}} href="#">Learn More</a>
                        </div>
                    </div>
                    <hr />
                    <div className={style.SingleProductBoxthirdDiv}>
                        <div style={{fontSize:"40px"}}><FcApproval/></div>
                        <div>
                           <h3 style={{fontWeight:"bold"}}>eBay Money Back Guarantee</h3>
                           <p>Get the item you ordered or get your money back.</p>
                           <a style={{color:"blue"}} href="#">Learn More</a>
                        </div>
                    </div>
                    <hr />
                    <h2 style={{fontWeight:"bold"}}>Seller information</h2>
                    <h3>amazing-wireless (127162)</h3>
                    <p>99.9% Positive feedback</p>
                </div>
            </div>
            <br />
            <br />
            <div>
                <Carousel/>
                <br />
                <br />
                <div>
                    <h1 style={{fontSize:"18px",color:"blue"}}>Payment</h1>
                    <hr />
                    <Box p={4}>
                        <p>PayPal is the only form of payment accepted and Immediate Payment is required.</p>
                        <p>Unfortunately, transactions cannot be cancelled after payment has been made. Please read the entire description prior to making a purchase.</p>
                        <p>Purchases by resellers are subject to cancellation at our discretion.</p>
                        <p>We have multiple physical locations in the US; residents of these states will be charged tax according to the state they reside in. This information is available at checkout.</p>

                    </Box>
                    <h1 style={{fontSize:"18px",color:"blue"}}>Shipping</h1>
                    <hr />
                    <Box p={4}>
                        <p>Items ship within 1 business day of cleared payment.</p>
                        <p>Items can only be shipped to the lower 48 United States. FedEx packages cannot be shipped to P.O. Boxes, APO/FPO, Hawaii, Guam, Puerto Rico, or Alaska.</p>
                        <p>We do not ship outside of the United States, or to freight forwarding companies.</p>
                        <p>We do not sell products to resellers.</p>
                        <p>Bidding on or attempting to purchase our items if you live in any of these locations or meet these restrictions will result in your payment being refunded and the transaction canceled.</p>
                        <p>Items are shipped from multiple locations throughout the United States. Combined shipping is not guaranteed even if multiple items are paid with the same payment.</p>
                        <p>Unfortunately, local pick-up is not available.</p>
                        <p>All items above $750 require a signature at delivery.</p>
                        <p>All packages that are returned to us by FedEx as undeliverable are subject to an additional shipping charge to re-ship the item. If we attempt to contact a buyer and do not receive a response within 3 days of receiving the item, the transaction will be subject to cancellation and a restocking fee.</p>
                        <p>Please make sure the ship to address is correct at the time of payment. We are not responsible for packages that are shipped to the incorrect address due to buyer error.</p>
                        <p>In the checkout process, a phone number must be added since our delivery company requires this for all packages.</p>
                    </Box>
                    <h1 style={{fontSize:"18px",color:"blue"}}>Warranty</h1>
                    <hr />
                    <Box p={4}>
                        <p>For functionality, this item comes with a one year warranty from Quick Ship from the date of delivery. If a problem occurs, we are happy to help you. Please contact us via email with a detailed description of the issue so we can assist.</p>
                        <p>Within the first 30 days, we will send a prepaid shipping label to send the unit back for an exchange (pending availability) or full refund. After 30 days, buyers are responsible for the shipping costs associated with shipping the item back to us.</p>
                        <p>We are unable to issue refunds for transactions older than 30 days, but will do our best to either repair your item or provide a comparable replacement.</p>
                        <p>Turnaround time once the non-working item is received is 2-4 business days, depending on the issue or the extent of testing required. Please contact us for full warranty details.</p>
                    </Box>
                </div>
            </div>
           
        </div>
         <Footer/>
        </div>
    )
}
export default SingleProduct