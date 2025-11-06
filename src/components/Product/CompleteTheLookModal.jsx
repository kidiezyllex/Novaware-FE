import React, { useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FaTshirt, FaChartLine, FaVenusMars, FaInfoCircle, FaDollarSign, FaGem, FaFemale, FaShoePrints } from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import { makeStyles } from "@material-ui/core/styles";
import { formatPriceDollar } from "../../utils/formatPrice.js";
import { useGNNOutfitPerfect } from "../../hooks/api/useRecommend";
import LottieLoading from "../LottieLoading.jsx";
import { toast } from "react-toastify";
import CallMadeIcon from "@material-ui/icons/CallMade";

const useStyles = makeStyles((theme) => ({
    outfitModal: {
        "& .MuiDialog-paper": {
            maxWidth: "90vw",
            height: "90vh",
            borderRadius: 12,
        },
    },
    outfitModalContent: {
        padding: "0 24px 24px 24px !important",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
    },
    dialogTitle: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid #e0e0e0",
        margin: 0,
    },
    closeButton: {
        position: "absolute",
        right: 8,
        top: 8,
        color: theme.palette.grey[500],
        "&:hover": {
            color: theme.palette.secondary.main,
            backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
    },
    outfitCard: {
        marginBottom: 24,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
    },
    outfitHeader: {
        padding: "16px 20px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
    },
    outfitBody: {
        padding: "20px",
    },
    categorySection: {
        marginBottom: 20,
        "&:last-child": {
            marginBottom: 0,
        },
    },
    categoryTitle: {
        fontSize: "1.1rem",
        fontWeight: 600,
        marginBottom: 12,
        color: theme.palette.text.primary,
        display: "flex",
        alignItems: "center",
        "&::before": {
            content: '""',
            width: 4,
            height: 20,
            backgroundColor: theme.palette.secondary.main,
            marginRight: 8,
            borderRadius: 2,
        },
    },
    tableContainer: {
        marginTop: 16,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        minHeight: 0,
        "& > .MuiPaper-root": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            flex: 1,
        },
        "@media (max-width: 768px)": {
            overflowX: "scroll",
        },
    },
    table: {
        minWidth: 650,
        "@media (max-width: 768px)": {
            minWidth: "100%",
        },
    },
    tableHeader: {
        backgroundColor: "#E8F4FD",
        "& .MuiTableCell-head": {
            color: "#000",
            fontWeight: 600,
            fontSize: "1rem",
            padding: "12px",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#E8F4FD",
        },
    },
    headerIcon: {
        marginRight: 8,
        fontSize: "1.2rem",
        verticalAlign: "middle",
        color: "#0ea5e9",
    },
    headerContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    tableCell: {
        padding: "0px",
        borderRadius: 0,
        verticalAlign: "top",
        width: "20%",
        "&:last-child": {
            borderRight: "none",
        },
        backgroundColor: "#FAFAFA",
    },
    productCardContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    productCard: {
        width: "100%",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        backgroundColor: "#fff",
        borderRadius: 0,
        boxShadow: "none",
        border: "1px solid #e0e0e0",
    },
    productImage: {
        width: "100%",
        height: 200,
        objectFit: "contain",
        backgroundColor: "#fff",
    },
    productInfo: {
        padding: 12,
        borderTop: "1px solid #e0e0e0",
    },
    productName: {
        fontSize: "0.9rem",
        fontWeight: 500,
        marginBottom: 8,
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        minHeight: 40,
    },
    productPrice: {
        fontSize: "1rem",
        fontWeight: 600,
        color: theme.palette.secondary.main,
    },
    outfitMeta: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        backgroundColor: "#fff",
    },
    outfitMetaItem: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: "0.85rem",
        color: theme.palette.text.secondary,
    },
    metaChip: {
        borderRadius: 16,
        padding: "6px",
        fontSize: "0.85rem",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s ease",
        "&:hover": {
            transform: "translateY(-1px)",
        },
        "& svg": {
            fontSize: 14,
        },
    },
    styleChip: {
        backgroundColor: "#dbeafe",
        border: "1px solid #3b82f6",
        color: "#1e40af",
        boxShadow: "0 1px 3px rgba(59, 130, 246, 0.2)",
        "&:hover": {
            backgroundColor: "#bfdbfe",
            boxShadow: "0 3px 6px rgba(59, 130, 246, 0.3)",
        },
        "& svg": {
            color: "#1e3a8a",
        },
    },
    totalChip: {
        backgroundColor: "#dcfce7",
        border: "1px solid #22c55e",
        color: "#166534",
        boxShadow: "0 1px 3px rgba(34, 197, 94, 0.2)",
        "&:hover": {
            backgroundColor: "#bbf7d0",
            boxShadow: "0 3px 6px rgba(34, 197, 94, 0.3)",
        },
        "& svg": {
            color: "#15803d",
        },
    },
    compatibilityChip: {
        backgroundColor: "#fed7aa",
        border: "1px solid #f97316",
        color: "#9a3412",
        boxShadow: "0 1px 3px rgba(249, 115, 22, 0.2)",
        "&:hover": {
            backgroundColor: "#fdba74",
            boxShadow: "0 3px 6px rgba(249, 115, 22, 0.3)",
        },
        "& svg": {
            color: "#c2410c",
        },
    },
    genderChip: {
        backgroundColor: "#f3e8ff",
        border: "1px solid #a855f7",
        color: "#6b21a8",
        boxShadow: "0 1px 3px rgba(168, 85, 247, 0.2)",
        "&:hover": {
            backgroundColor: "#e9d5ff",
            boxShadow: "0 3px 6px rgba(168, 85, 247, 0.3)",
        },
        "& svg": {
            color: "#7e22ce",
        },
    },
    descriptionChip: {
        backgroundColor: "#cffafe",
        border: "1px solid #06b6d4",
        color: "#155e75",
        boxShadow: "0 1px 3px rgba(6, 182, 212, 0.2)",
        "&:hover": {
            backgroundColor: "#a5f3fc",
            boxShadow: "0 3px 6px rgba(6, 182, 212, 0.3)",
        },
        "& svg": {
            color: "#164e63",
        },
    },
}));

const CompleteTheLookModal = ({ open, onClose, userId, productId, user }) => {
    const classes = useStyles();
    
    const queryParams = {
        productId: productId || "",
        k: 9,
        pageNumber: 1,
        perPage: 9,
    };
    
    if (user?.gender) {
        queryParams.gender = user.gender;
    }
    
    const {
        data: outfitData,
        isLoading: outfitLoading,
        error: outfitError,
    } = useGNNOutfitPerfect(userId || "", queryParams);

    const getCategoryIcon = (categoryName) => {
        const key = categoryName.trim().toLowerCase();
        switch (key) {
            case "tops":
                return <FaTshirt className={classes.headerIcon} />;
            case "dresses":
                return <FaFemale className={classes.headerIcon} />;
            case "bottoms":
                return <PiPants className={classes.headerIcon} />;
            case "shoes":
                return <FaShoePrints className={classes.headerIcon} />;
            case "accessories":
                return <FaGem className={classes.headerIcon} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (!open) return;
        if (!userId) {
            toast.info("Please sign in to see outfit recommendations.");
            onClose();
            return;
        }
        if (!user?.gender) {
            toast.info("Please update your profile with gender information to see outfit recommendations.");
        }
        if (outfitError) {
            toast.error("Failed to load outfit recommendations.");
        }
    }, [open, userId, user?.gender, outfitError, onClose]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            className={classes.outfitModal}
            style={{ zIndex: 9999 }}
            BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        >
            <DialogTitle className={classes.dialogTitle}>
                <Typography variant="h5" align="center" className="tracking-widest">Complete the Look</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className={classes.closeButton}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.outfitModalContent}>
                {userId && outfitLoading && (
                    <LottieLoading />
                )}
                {userId && !outfitLoading && !outfitError && outfitData?.data?.outfits?.length > 0 && (
                    <>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table className={classes.table} aria-label="outfit table" stickyHeader>
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        {["Tops", "Dresses", "Bottoms", "Shoes", "Accessories"].map((category) => (
                                            <TableCell key={category} align="center">
                                                <Box className={classes.headerContent}>
                                                    {getCategoryIcon(category)}
                                                    <Typography variant="body1" component="span">
                                                        {category}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outfitData.data.outfits.map((outfit, outfitIndex) => {
                                        const categories = ["Tops", "Dresses", "Bottoms", "Shoes", "Accessories"];
                                        const productsByCategory = {
                                            Tops: [],
                                            Dresses: [],
                                            Bottoms: [],
                                            Shoes: [],
                                            Accessories: [],
                                            Other: [],
                                        };

                                        outfit.products?.forEach((p) => {
                                            const category = p.category || "Other";
                                            if (productsByCategory[category]) {
                                                productsByCategory[category].push(p);
                                            } else {
                                                productsByCategory.Other.push(p);
                                            }
                                        });

                                        const renderProductCard = (product) => (
                                            <Card
                                                key={product._id}
                                                className={classes.productCard}
                                                onClick={() => window.open(`/product?id=${product._id || ''}`, "_blank")}
                                            >
                                                <img
                                                    src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/200"}
                                                    alt={product.name}
                                                    className={classes.productImage}
                                                />
                                                <Box className={classes.productInfo}>
                                                    <Typography className={classes.productName} variant="body2">
                                                        {product.name}
                                                    </Typography>
                                                    <Typography className={classes.productPrice}>
                                                        {formatPriceDollar((product.price || 0) * (1 - ((product.sale || 0) / 100)))}
                                                        {product.sale && product.sale > 0 && (
                                                            <Typography
                                                                component="span"
                                                                style={{
                                                                    fontSize: "0.8rem",
                                                                    textDecoration: "line-through",
                                                                    color: "#999",
                                                                    marginLeft: 8,
                                                                }}
                                                            >
                                                                {formatPriceDollar(product.price || 0)}
                                                            </Typography>
                                                        )}
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="medium"
                                                        style={{ width: "100%", marginTop: 8 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`/product?id=${product._id || ''}`, "_blank");
                                                        }}
                                                        endIcon={<CallMadeIcon />}
                                                    >
                                                        View details
                                                    </Button>
                                                </Box>
                                            </Card>
                                        );

                                        return (
                                            <React.Fragment key={outfitIndex}>
                                                {/* Row 1: Outfit name and product cards */}
                                                <TableRow>
                                                    {categories.map((category, categoryIndex) => (
                                                        <TableCell key={category} className={classes.tableCell} align="center" style={{ verticalAlign: "top" }}>
                                                            {categoryIndex === 0 ? (
                                                                <Box>

                                                                    <Box className={classes.productCardContainer}>
                                                                        {productsByCategory[category]?.length > 0 ? (
                                                                            productsByCategory[category].map((product) => renderProductCard(product))
                                                                        ) : (
                                                                            <Typography variant="body2" color="textSecondary" style={{ textAlign: "center", padding: "20px" }}>
                                                                                No items
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            ) : (
                                                                <Box className={classes.productCardContainer}>
                                                                    {productsByCategory[category]?.length > 0 ? (
                                                                        productsByCategory[category].map((product) => renderProductCard(product))
                                                                    ) : (
                                                                        <Typography variant="body2" color="textSecondary" style={{ textAlign: "center", padding: "20px" }}>
                                                                            No items
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                {/* Row 2: Metadata information spanning all columns */}
                                                <TableRow>
                                                    <TableCell
                                                        className={classes.tableCell}
                                                        colSpan={categories.length}
                                                        style={{ backgroundColor: "#fff", padding: "12px 16px", borderRight: "1px solid #e0e0e0" }}
                                                    >
                                                        <Box className={classes.outfitMeta} style={{ flexDirection: "row", alignItems: "center", gap: 16, flexWrap: "wrap", backgroundColor: "#fff" }}>
                                                            <Typography variant="h6" component="h3">
                                                                {outfit.name || `Outfit ${outfitIndex + 1}`}
                                                            </Typography>
                                                            {outfit.style && (
                                                                <Chip
                                                                    icon={<FaTshirt />}
                                                                    label={`Style: ${outfit.style}`}
                                                                    className={`${classes.metaChip} ${classes.styleChip}`}
                                                                    size="small"
                                                                />
                                                            )}
                                                            <Chip
                                                                icon={<FaDollarSign />}
                                                                label={`Total: ${formatPriceDollar(outfit.totalPrice || 0)}`}
                                                                className={`${classes.metaChip} ${classes.totalChip}`}
                                                                size="small"
                                                            />
                                                            {outfit.compatibilityScore !== undefined && (
                                                                <Chip
                                                                    icon={<FaChartLine />}
                                                                    label={`Compatibility: ${(outfit.compatibilityScore * 100).toFixed(0)}%`}
                                                                    className={`${classes.metaChip} ${classes.compatibilityChip}`}
                                                                    size="small"
                                                                />
                                                            )}
                                                            {outfit.gender && (
                                                                <Chip
                                                                    icon={<FaVenusMars />}
                                                                    label={`Gender: ${outfit.gender}`}
                                                                    className={`${classes.metaChip} ${classes.genderChip}`}
                                                                    size="small"
                                                                />
                                                            )}
                                                            {outfit.description && (
                                                                <Chip
                                                                    icon={<FaInfoCircle />}
                                                                    label={outfit.description}
                                                                    className={`${classes.metaChip} ${classes.descriptionChip}`}
                                                                    size="small"
                                                                />
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
                {userId && !outfitLoading && !outfitError && (!outfitData?.data?.outfits || outfitData.data.outfits.length === 0) && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Typography variant="body1" color="textSecondary">
                            No outfit recommendations available at the moment.
                        </Typography>
                    </Box>
                )}
                {userId && !outfitLoading && outfitError && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Typography variant="body1" color="error">
                            Failed to load outfit recommendations. Please try again later.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CompleteTheLookModal;

