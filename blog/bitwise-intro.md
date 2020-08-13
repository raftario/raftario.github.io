---
layout: BlogPost
title: A quick introduction to bitwise trickery
description: A (hopefully) beginner friendly introduction to boolean algebra and bitwise operations
author: Raphaël Thériault
date: "2020-08-12"
---

[[toc]]

---

## Introduction

Bitwise operations are just like normal arithmetic ones, except that instead of treating numbers as numbers, they treat them as a sequence of bits. While they might not sound very useful at first, they can be extremely useful in certain scenarios, and also allow storing a lot of information in a compact way and making some operations a lot more efficient.

This post is separated in two parts; a theoretical introduction to bitwise operations and their backing concepts, and a small collection of real world use cases for them. While they are written in Rust, they should be simple enough to be translated to any language easily. As this post is a beginner introduction, I'd recommend trying to find a solution before looking at the code samples.

## Boolean algebra

Boolean algebra was introduced by George Boole in the 1800s. It uses the truth values (or booleans, this is where the word comes from) $true$ and $false$, or $1$ and $0$, which makes it a perfect fit for bitwise operations.

This post will focus on the four operations mainly used in programming. For more information on boolean algebra, [the Wikipedia page](https://en.wikipedia.org/wiki/Boolean_algebra) is a good starting point.

### NOT (or negation)

NOT is denoted as $\lnot x$ and is the simplest of the four. It simply inverts the value of its operand.

| $x$ | $\lnot x$ |
|:---:|:---------:|
| $1$ | $0$       |
| $0$ | $1$       |

### AND (or conjunction)

AND is denoted as $x \land y$. It evaluates to $1$ if both of its operands evaluate to $1$, or $0$ otherwise.

| $x$ | $y$ | $x \land y$ |
|:---:|:---:|:-----------:|
| $1$ | $1$ | $1$         |
| $1$ | $0$ | $0$         |
| $0$ | $1$ | $0$         |
| $0$ | $0$ | $0$         |

### OR (or disjunction)

OR is denoted as $x \lor y$. It evaluates to $1$ if at least one of its operands evaluate to $1$, or $0$ otherwise.

| $x$ | $y$ | $x \lor y$ |
|:---:|:---:|:----------:|
| $1$ | $1$ | $1$        |
| $1$ | $0$ | $1$        |
| $0$ | $1$ | $1$        |
| $0$ | $0$ | $0$        |

### XOR (or exclusive OR)

XOR is denoted as $x \oplus y$. Unlike the previous operators, which were primary operators, it's a secondary operator. This means it can be constructed using primary operators ($x \oplus y$ is equal to $(x \land \lnot y) \lor (\lnot x \land y)$). It's also the most commonly used operator in programming. It evaluates to $1$ if its operands evaluate to different truth values, or $0$ otherwise.

| $x$ | $y$ | $x \oplus y$ |
|:---:|:---:|:------------:|
| $1$ | $1$ | $0$          |
| $1$ | $0$ | $1$          |
| $0$ | $1$ | $1$          |
| $0$ | $0$ | $0$          |

## Binary representation

Natural numbers (or unsigned integers) are internally represented as a sequence of bits in base two (negative integers usually use [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) representation which is very similar but not in the scope of this post).

To better understand how the usual base ten representation works, let's use the base 10 number $139$ as an example. If we treat it as a sequence of base ten digits, we can calculate its value by doing $(9 \times 10^0) + (3 \times 10^1) + (1 \times 10^2)$. To put it into words, the value of a base ten number can be calculated by multiplying each digit by ten to the power of the position of the digit, where the position of the least significant digit is equal to zero.

This works for any base, including base two. The value of a base $b$ number can be calculated by multiplying each digit by $b$ to the power of the position of the digit. If you're not sure about about the concept yet, just write random sequences of $0$s and $1$s and calculate their value in base two.

## Bitwise operations

As stated in the introduction, bitwise operators treat numbers as a sequence of bits, this sequence being their internal binary representation. The four boolean algebra operations listed earlier ar all present in most programming languages. Usually, NOT is written `~` or `!`, AND is written `&`, OR is written `|` and XOR is written `^`. They apply to every bit of the internal representations individually. For instance, `~0b01 == 0b10` and `0b01 ^ 0b11 == 0b10`.

There is also another very important bitwise operation; bit shifting.

### Bit shifting

Bit shifting consists of taking the binary representation of a number and shifting it by a given amount of bits, either left or right. A left shift is usually written `<<` and a right shift is usually written `>>`. For instance, `0b01 << 1 == 0b10`.

> This post only discusses unsigned integers, where zeros are shifted to replace missing bits. However, when dealing with signed numbers, it is important to know the difference between logical and arithmetic shifting to know what new bits will be shifted to replace the missing ones. See [the Wikipedia article](https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts) for details.

## Bit masks

The most common pattern when playing with bitwise operators is bit masking. A bit mask is just a number, for instance `0b0010` masks every bit except the second one. Bit masks can be used with OR, AND and XOR, all for different purposes.

### Getting bits

Using a bit mask with AND makes it possible to get only the unmasked bits and ignore the others. `x & 0b0010` gets the second bit of `x`, for instance `0b0101 & 0b0010 == 0b0000` and `0b1010 & 0b0010 == 0b0010`. This is based on two properties of AND; $x \land 0$ is always $0$, and $x \land 1$ is always $x$.

### Un/Setting bits

Using a bit mask with OR makes it possible to set only the unmasked bits to `1` and ignore the others. `x | 0b0010` sets the second bit of `x` to `1`, for instance `0b0101 | 0b0010 == 0b0111`. This is based on two properties of OR; $x \lor 1$ is always $1$, and $x \lor 0$ is always $x$.

The opposite is also possible. Using a bit mask with AND can also be used to set only the masked bits to `0` (or unset them) and ignore the others. `x & 0b1101` sets the second bit of `x` to `0`, for instance `0b1010 & 0b1101 == 0b1000`. This is based on the two properties of AND used for getting bits.

### Inverting bits

Using a bit mask with XOR makes it possible to invert only the unmasked bits and ignore the others. `x ^ 0b0010` inverts the second bit of `x`, for instance `0b0101 ^ 0b0010 == 0b0111` and `0b1010 ^ 0b0010 == 0b1000`. This is based on two properties of XOR; $x \oplus 0$ is always $x$, and $x \oplus 1$ is always $\lnot x$.

---

## Getting, un/setting or inverting a given bit

Those four operations all share a lot of the same logic, so they're grouped together. Given an arbitrary number and an arbitrary position, how could one get, set, unset or invert the bit at this position ?

### Code

```rs
fn mask(pos: usize) -> usize {
    0b1 << pos
}

fn get(n: usize, pos: usize) -> bool {
    n & mask(pos) != 0
}

fn set(n: usize, pos: usize) {
    n | mask(pos)
}

fn unset(n: usize, pos: usize) {
    n & !mask(pos)
}

fn invert(n: usize, pos: usize) {
    n ^ mask(pos)
}
```

### Explanation

The section on bit masks already explains how to do all of those, so the main point of interest is how a mask is constructed for any given position. The answer is pretty easy; just take `0b1` and shift it left to the given position. When unsetting though, we need a mask that is the exact opposite, and we can't just shift a `0b0` since the missing bits at the right will also be zeros. Thankfully, NOT does exactly what we need when applied to the constructed mask.

Another small point of interest is how `get` returns a boolean. When getting a single bit, if the bit is zero, the whole number will be zero, so we can compare the result to zero to determine if the bit was set.

## Un/Merging multiple small numbers

When storing and transmitting data, it's often useful to compress it as much as possible. Given two numbers which are guaranteed to fit in 4 bits, how could one merge them into a single 8 bits number, and go the other way ?

### Code

```rs
fn merge(n1: u8, n2: u8) -> u8 {
    n1 | (n2 << 4)
}

fn unmerge(n: u8) -> (u8, u8) {
    let n1 = n & 0b00001111;
    let n2 = (n & 0b11110000) >> 4;
    (n1, n2)
}
```

### Explanation

Since the small numbers are guaranteed to fit in 4 bits, we can use the lower 4 bits for the first number and the higher 4 bits for the second number. We know the higher 4 bits of the first number will all be zeros since it fits in the 4 lower bits. We can then shift the second number left by 4 bits, which will fill its lower 4 bits with zeros. We can then OR the two together and effectively merge them since $x \lor 0$ is always $x$.

When going the other way around, we use masks to get only the lower bits occupied by the first number and only the higher bits occupied by the second number. We can then shift the second number right by 4 bits to it's original position.

This concept can be used with any amount of numbers and any size.
