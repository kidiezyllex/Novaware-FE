import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../actions/cartActions";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Box,
} from "@material-ui/core";
import { AiOutlineSync } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
}));

const ProductFormSelect = ({ item, className }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { control, handleSubmit, setValue } = useForm();
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (item.color && item.color.length > 0) {
      const newSelectedColor = item.colorSelected
        ? item.color.find((c) => c.name === item.colorSelected) || item.color[0]
        : item.color[0];
      setSelectedColor(newSelectedColor);
      setValue("color", newSelectedColor.hexCode);
    }
    const defaultSize =
      item.sizeSelected && Object.prototype.hasOwnProperty.call(item.size, item.sizeSelected)
        ? item.sizeSelected
        : Object.keys(item.size)[0];
    setValue("size", defaultSize);
  }, [item.color, item.colorSelected, item.sizeSelected, item.size, setValue]);

  const updateCartHandler = (data, id) => {
    const selectedColorName = selectedColor ? selectedColor.name : "";

    const oldSize = item.sizeSelected;
    const oldColor = item.colorSelected;

    const newSize = data.size;
    const newColor = selectedColorName;

    // Nếu không có thay đổi gì thì không làm gì cả
    if (oldSize === newSize && oldColor === newColor && item.qty === data.qty) {
      toast.info("Không có thay đổi nào");
      return;
    }

    // 1. Xoá item cũ
    dispatch(removeFromCart(id, oldSize, oldColor));

    // 2. Thêm item mới
    dispatch(addToCart(id, data.qty, newSize, data.color, newColor));
    toast.success("Sản phẩm đã được cập nhật!");
  };

  return (
    <form
      className={clsx(classes.root, className && className)}
      onSubmit={handleSubmit((data) => {
        updateCartHandler(data, item.product);
      })}
    >
      {/* Dropdown chọn kích cỡ */}
      <FormControl variant="outlined" size="small">
        <InputLabel shrink id="size-select-label">
          Size
        </InputLabel>
        <Controller
          name="size"
          control={control}
          defaultValue={item.sizeSelected}
          render={({ field }) => (
            <Select {...field} label="Size" autoWidth>
              {Object.keys(item.size).map((value) =>
                item.size[value] > 0 ? (
                  <MenuItem value={value} key={value}>
                    {value.toUpperCase()}
                  </MenuItem>
                ) : null
              )}
            </Select>
          )}
        />
      </FormControl>

      {/* Dropdown chọn màu sắc */}
      <FormControl variant="outlined" size="small">
        <InputLabel shrink id="color-select-label">
          Color
        </InputLabel>
        <Controller
          name="color"
          control={control}
          defaultValue={selectedColor ? selectedColor.hexCode : ""}
          render={({ field }) => (
            <Select
              {...field}
              label="Color"
              autoWidth
              onChange={(e) => {
                const color = item.color.find(
                  (c) => c.hexCode === e.target.value
                );
                setSelectedColor(color);
                field.onChange(e);
              }}
            >
              {item.color &&
                item.color.map((color) => (
                  <MenuItem value={color.hexCode} key={color.name}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Box
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.hexCode,
                          borderRadius: "50%",
                          marginRight: 8,
                        }}
                      />
                      <span>{color.name}</span>
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Dropdown chọn số lượng */}
      <FormControl variant="outlined" size="small">
        <InputLabel shrink id="quantity-select-label">
          Quantity
        </InputLabel>
        <Controller
          name="qty"
          control={control}
          defaultValue={item.qty}
          render={({ field }) => (
            <Select {...field} label="Qty" autoWidth>
              {Array(item.countInStock)
                .fill()
                .map((_, index) => (
                  <MenuItem value={index + 1} key={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Nút Cập Nhật Giỏ Hàng */}
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<AiOutlineSync color="#fff" />}
        disableElevation
      >
        Update
      </Button>
    </form>
  );
};

export default ProductFormSelect;
